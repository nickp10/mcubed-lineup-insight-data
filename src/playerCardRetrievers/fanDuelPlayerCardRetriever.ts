import { IPlayerCard, IPlayerCardRetriever, ContestType } from "../interfaces";
import utils from "../utils";

export default class FanDuelPlayerCardRetriever implements IPlayerCardRetriever {
    private static FAN_DUEL_ID_PREFIX = "FD";

    contestType = ContestType.FanDuel;

    playerCard(contestID: string, playerID: string): PromiseLike<IPlayerCard> {
        return this.getPlayerCard(contestID, playerID);
    }

    private getPlayerCard(contestID: string, playerID: string): PromiseLike<IPlayerCard> {
        const rawContestID = this.getRawContestID(contestID);
        return utils.sendHttpsRequest({
            hostname: "api.fanduel.com",
            path: `/fixture-lists/${rawContestID}/players/${rawContestID}-${playerID}`,
            method: "GET",
            headers: {
                "Authorization": "Basic N2U3ODNmMTE4OTIzYzE2NzVjNWZhYWFmZTYwYTc5ZmM6"
            }
        }).then((dataResp) => {
            return this.parsePlayerCard(dataResp.body, rawContestID, playerID);
        });
    }

    parsePlayerCard(data: string, contestID: string, playerID: string): IPlayerCard {
        var card: IPlayerCard = {
            gameLog: [],
            news: []
        };
        const jsonData = JSON.parse(data);
        if (jsonData) {
            const players = jsonData["players"];
            if (Array.isArray(players)) {
                const id = `${contestID}-${playerID}`;
                const player = players.find(p => p["id"] === id);
                if (player) {
                    const gameLog = player["fixture_stats"]["_members"];
                    if (Array.isArray(gameLog)) {
                        this.parseGameLog(card, jsonData, player, gameLog);
                    }
                    const news = player["news"]["articles"]["_members"];
                    if (Array.isArray(news)) {
                        this.parseNews(card, jsonData, news);
                    }
                }
            }
        }
        return card;
    }

    private parseGameLog(card: IPlayerCard, jsonData: any, player: any, gameLogIDs: any[]): void {
        const gameLogs = jsonData["fixture_stats"];
        if (Array.isArray(gameLogs)) {
            for (let i = 0; i < gameLogIDs.length; i++) {
                const gameLogID = gameLogIDs[i];
                const gameLog = gameLogs.find(g => g["id"] === gameLogID);
                if (gameLog) {
                    const gameID = gameLog["fixture"]["_members"][0];
                    const game = this.findGame(jsonData, gameID);
                    if (game) {
                        const playerTeamID = player["team"]["_members"][0];
                        const awayTeamID = game["away_team"]["team"]["_members"][0];
                        const homeTeamID = game["home_team"]["team"]["_members"][0];
                        const opponentTeamID = playerTeamID === awayTeamID ? homeTeamID : awayTeamID;
                        const opponentPrefix = playerTeamID === awayTeamID ? "@ " : "vs. ";
                        const opponent = this.findTeam(jsonData, opponentTeamID);
                        if (opponent) {
                            card.gameLog.push({
                                date: new Date(game["start_date"]),
                                opponent: `${opponentPrefix}${opponent["code"]}`,
                                points: utils.coerceFloat(gameLog["score"])
                            });
                        }
                    }
                }
            }
        }
    }

    private parseNews(card: IPlayerCard, jsonData: any, newsItemIDs: any[]): void {
        const newsItems = jsonData["news"];
        if (Array.isArray(newsItems)) {
            for (let i = 0; i < newsItemIDs.length; i++) {
                const newsItemID = newsItemIDs[i];
                const newsItem = newsItems.find(n => n["id"] === newsItemID);
                if (newsItem) {
                    card.news.push({
                        date: new Date(newsItem["date"]),
                        details: newsItem["details"],
                        summary: newsItem["summary"]
                    });
                }
            }
        }
    }

    private findGame(jsonData: any, gameID: string): any {
        const games = jsonData["fixtures"];
        if (Array.isArray(games)) {
            return games.find(g => g["id"] === gameID);
        }
        return undefined;
    }

    private findTeam(jsonData: any, teamID: string): any {
        const teams = jsonData["teams"];
        if (Array.isArray(teams)) {
            return teams.find(t => t["id"] === teamID);
        }
        return undefined;
    }

    private getRawContestID(id: string): string {
        return id.replace(new RegExp(`^${FanDuelPlayerCardRetriever.FAN_DUEL_ID_PREFIX}`), "");
    }
}
