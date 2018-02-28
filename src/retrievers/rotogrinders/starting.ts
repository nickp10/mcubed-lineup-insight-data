import { IPlayer, IPlayerInsightRetriever, IPlayerStats, ContestType, Sport } from "../../interfaces";
import PlayerFactory from "../../playerFactory";
import * as cheerio from "cheerio";
import utils from "../../utils";

export default class RGStarting implements IPlayerInsightRetriever {
    playerInsight(contestType: ContestType, sport: Sport): PromiseLike<IPlayer[]> {
        const playerFactory = new PlayerFactory(sport);
        switch (contestType) {
            case ContestType.DraftKings:
                switch (sport) {
                    case Sport.MLB:
                        return this.getData(playerFactory, "draftkings", "mlb");
                    case Sport.NBA:
                        return this.getData(playerFactory, "draftkings", "nba");
                    case Sport.NFL:
                        return this.getData(playerFactory, "draftkings", "nfl");
                    case Sport.NHL:
                        return this.getData(playerFactory, "draftkings", "nhl");
                }
                break;
            case ContestType.FanDuel:
                switch (sport) {
                    case Sport.MLB:
                        return this.getData(playerFactory, "fanduel", "mlb");
                    case Sport.NBA:
                        return this.getData(playerFactory, "fanduel", "nba");
                    case Sport.NFL:
                        return this.getData(playerFactory, "fanduel", "nfl");
                    case Sport.NHL:
                        return this.getData(playerFactory, "fanduel", "nhl");
                }
                break;
            case ContestType.Yahoo:
                switch (sport) {
                    case Sport.MLB:
                        return this.getData(playerFactory, "yahoo", "mlb");
                    case Sport.NBA:
                        return this.getData(playerFactory, "yahoo", "nba");
                    case Sport.NFL:
                        return this.getData(playerFactory, "yahoo", "nfl");
                    case Sport.NHL:
                        return this.getData(playerFactory, "yahoo", "nhl");
                }
                break;
        }
        return Promise.reject<IPlayer[]>("An unknown contest type or sport was specified");
    }

    private getData(playerFactory: PlayerFactory, contest: string, sport: string): PromiseLike<IPlayer[]> {
        return utils.sendHttpsRequest({
            hostname: "rotogrinders.com",
            path: `/lineups/${sport}?site=${contest}`,
            method: "GET"
        }).then((dataResp) => {
            return this.parsePlayers(playerFactory, dataResp.body, sport);
        });
    }

    parsePlayers(playerFactory: PlayerFactory, data: string, sport: string): IPlayer[] {
        return this.parsePlayersCheerio(playerFactory, cheerio.load(data), sport);
    }

    private parsePlayersCheerio(playerFactory: PlayerFactory, $: CheerioStatic, sport: string): IPlayer[] {
        const players: IPlayer[] = [];
        $("li[data-role=lineup-card]").each((index, element) => {
            const game = $(element);
            const away = game.attr("data-away");
            const home = game.attr("data-home");
            this.parsePlayersForLineup(playerFactory, players, $("div[class*=away-team]", game).first(), away, sport);
            this.parsePlayersForLineup(playerFactory, players, $("div[class*=home-team]", game).first(), home, sport);
        });
        return players;
    }

    private parsePlayersForLineup(playerFactory: PlayerFactory, players: IPlayer[], lineup: Cheerio, team: string, sport: string): void {
        if (team) {
            if (sport === "nhl" || sport === "mlb") {
                const pitcher = cheerio("div[class*=pitcher] a", lineup).first();
                if (pitcher) {
                    const player = this.createPlayer(playerFactory, pitcher, pitcher, sport, team, -1);
                    if (player) {
                        players.push(player);
                    }
                }
            }
            cheerio("ul[class*=players]", lineup).each((index, element) => {
                let hasSeenPlayer = false;
                const playerItems = cheerio("li", element);
                for (let i = 0; i < playerItems.length; i++) {
                    const playerItem = cheerio(playerItems.get(i));
                    if (sport === "nba") {
                        if (playerItem.html() === "Bench") {
                            break;
                        }
                    }
                    if (playerItem.attr("class") === "player") {
                        if (sport === "nfl") {
                            if (hasSeenPlayer && i + 1 === playerItems.length) {
                                break;
                            }
                        }
                        const salary = playerItem.attr("data-salary");
                        if (salary) {
                            const playerName = cheerio("span[class=pname] a", playerItem).first();
                            const player = this.createPlayer(playerFactory, playerItem, playerName, sport, team, this.parseSalary(salary));
                            if (player) {
                                hasSeenPlayer = true;
                                players.push(player);
                            }
                        }
                    }
                }
            });
        }
        return undefined;
    }

    private parseSalary(salary: string): number {
        salary = salary.replace("$", "").toLowerCase();
        const thousand = salary.indexOf("k");
        if (thousand >= 0) {
            const value = utils.coerceFloat(salary.substr(0, thousand));
            return value * 1000;
        } else {
            return utils.coerceInt(salary);
        }
    }

    private createPlayer(playerFactory: PlayerFactory, playerItem: Cheerio, playerName: Cheerio, sport: string, team: string, salary: number): IPlayer {
        let name = playerName.attr("title");
        if (!name) {
            name = playerName.html();
        }
        if (name) {
            const player = playerFactory.createPlayer(name, team, salary);
            if (sport === "mlb") {
                const startingOrder = cheerio("span[class=order]", playerItem).html();
                player.battingOrder = this.parseBattingOrder(startingOrder);
            }
            player.isStarter = true;
            return player;
        }
        return undefined;
    }

    private parseBattingOrder(startingOrder: string): string {
        try {
            const order = utils.coerceInt(startingOrder);
            if (order === 1) {
                return "1st";
            } else if (order === 2) {
                return "2nd";
            } else if (order === 3) {
                return "3rd";
            } else if (order >= 4 && order <= 9) {
                return `${order}th`;
            }
        } catch(Error) {
        }
        return "NA";
    }
}
