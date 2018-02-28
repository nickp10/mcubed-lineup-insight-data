import { IIncomingMessage, IPlayer, IPlayerInsightRetriever, IPlayerStats, ContestType, Sport } from "../interfaces";
import * as cheerio from "cheerio";
import PlayerFactory from "../playerFactory";
import * as setCookieParser from "set-cookie-parser";
import utils from "../utils";

export default class NumberFire implements IPlayerInsightRetriever {
    // IDs for setting the DFS site to retrieve projection stats for
    private static fanDuelID = "3";
    private static draftKingsID = "4";
    private static yahooID = "13";

    // URL to post the DFS site ID to for each sport
    private static mlbSetSiteURL = "/mlb/daily-fantasy/set-dfs-site";
    private static nbaSetSiteURL = "/nba/daily-fantasy/set-dfs-site";
    private static nflSetSiteURL = "/nfl/daily-fantasy/set-dfs-site";
    private static nhlSetSiteURL = "/nhl/daily-fantasy/set-dfs-site";

    // URLs for retrieving projections for each sport
    private static mlbDataSiteURLs = [
        "/mlb/daily-fantasy/daily-baseball-projections/pitchers",
        "/mlb/daily-fantasy/daily-baseball-projections/batters"
    ];
    private static nbaDataSiteURLs = [
        "/nba/daily-fantasy/daily-basketball-projections"
    ];
    private static nflDataSiteURLs = [
        "/nfl/daily-fantasy/daily-football-projections",
        "/nfl/daily-fantasy/daily-football-projections/K",
        "/nfl/daily-fantasy/daily-football-projections/D"
    ];
    private static nhlDataSiteURLs = [
        "/nhl/daily-fantasy/daily-hockey-projections/skaters",
        "/nhl/daily-fantasy/daily-hockey-projections/goalies"
    ];

    playerInsight(contestType: ContestType, sport: Sport): PromiseLike<IPlayer[]> {
        const playerFactory = new PlayerFactory(sport);
        switch (contestType) {
            case ContestType.DraftKings:
                switch (sport) {
                    case Sport.MLB:
                        return this.getData(playerFactory, NumberFire.mlbSetSiteURL, NumberFire.draftKingsID, NumberFire.mlbDataSiteURLs);
                    case Sport.NBA:
                        return this.getData(playerFactory, NumberFire.nbaSetSiteURL, NumberFire.draftKingsID, NumberFire.nbaDataSiteURLs);
                    case Sport.NFL:
                        return this.getData(playerFactory, NumberFire.nflSetSiteURL, NumberFire.draftKingsID, NumberFire.nflDataSiteURLs);
                    case Sport.NHL:
                        return this.getData(playerFactory, NumberFire.nhlSetSiteURL, NumberFire.draftKingsID, NumberFire.nhlDataSiteURLs);
                }
                break;
            case ContestType.FanDuel:
                switch (sport) {
                    case Sport.MLB:
                        return this.getData(playerFactory, NumberFire.mlbSetSiteURL, NumberFire.fanDuelID, NumberFire.mlbDataSiteURLs);
                    case Sport.NBA:
                        return this.getData(playerFactory, NumberFire.nbaSetSiteURL, NumberFire.fanDuelID, NumberFire.nbaDataSiteURLs);
                    case Sport.NFL:
                        return this.getData(playerFactory, NumberFire.nflSetSiteURL, NumberFire.fanDuelID, NumberFire.nflDataSiteURLs);
                    case Sport.NHL:
                        return this.getData(playerFactory, NumberFire.nhlSetSiteURL, NumberFire.fanDuelID, NumberFire.nhlDataSiteURLs);
                }
                break;
            case ContestType.Yahoo:
                switch (sport) {
                    case Sport.MLB:
                        return this.getData(playerFactory, NumberFire.mlbSetSiteURL, NumberFire.yahooID, NumberFire.mlbDataSiteURLs);
                    case Sport.NBA:
                        return this.getData(playerFactory, NumberFire.nbaSetSiteURL, NumberFire.yahooID, NumberFire.nbaDataSiteURLs);
                    case Sport.NFL:
                        return this.getData(playerFactory, NumberFire.nflSetSiteURL, NumberFire.yahooID, NumberFire.nflDataSiteURLs);
                    case Sport.NHL:
                        return this.getData(playerFactory, NumberFire.nhlSetSiteURL, NumberFire.yahooID, NumberFire.nhlDataSiteURLs);
                }
                break;
        }
        return Promise.reject<IPlayer[]>("An unknown contest type or sport was specified");
    }

    private getData(playerFactory: PlayerFactory, setSiteURL: string, siteID: string, dataSiteURLs: string[]): PromiseLike<IPlayer[]> {
        return utils.sendHttpsRequest({
            hostname: "www.numberfire.com",
            path: setSiteURL,
            method: "POST"
        }, `site=${siteID}`).then((setSiteResp) => {
            return this.parseData(playerFactory, dataSiteURLs, setSiteResp);
        });
    }

    private getDataForURL(playerFactory: PlayerFactory, dataSiteURL: string, cookieHeaders: string[]): PromiseLike<IPlayer[]> {
        return utils.sendHttpsRequest({
            hostname: "www.numberfire.com",
            path: dataSiteURL,
            method: "GET",
            headers: {
                Cookie: cookieHeaders
            }
        }).then((dataResp) => {
            return this.parsePlayers(playerFactory, dataResp.body);
        });
    }

    parseData(playerFactory: PlayerFactory, dataSiteURLs: string[], setSiteResp: IIncomingMessage): PromiseLike<IPlayer[]> {
        const setCookies = setCookieParser(setSiteResp);
        const cookieHeaders = setCookies.map(c => `${c.name}=${c.value}`);
        const dataPromises = dataSiteURLs.map(dataSiteURL => this.getDataForURL(playerFactory, dataSiteURL, cookieHeaders));
        return Promise.all(dataPromises).then((playersArrays) => {
            return utils.flattenArray<IPlayer>(playersArrays);
        });
    }

    parsePlayers(playerFactory: PlayerFactory, data: string): IPlayer[] {
        return this.parsePlayersCheerio(playerFactory, cheerio.load(data));
    }

    private parsePlayersCheerio(playerFactory: PlayerFactory, $: CheerioStatic): IPlayer[] {
        const players: {[key:string]: IPlayer} = { };
        $(".stat-table__body tr").each((index, item) => {
            const playerId = $(item).data("player-id");
            let player = players[playerId];
            if (!player) {
                player = playerFactory.createPlayer();
                players[playerId] = player;
            }
            const playerName = $("a.full", item).text();
            const playerTeam = $(".team-player__team.active", item).text();
            const playerSalary = this.parseSalary($(item).find(".cost").text());
            playerFactory.updatePlayer(player, playerName, playerTeam, playerSalary);
            const points = $(item).find(".fp").text();
            if (points) {
                const stats: IPlayerStats = {
                    source: "NumberFire",
                    projectedPoints: utils.coerceFloat(points.trim())
                };
                let playerStats = player.stats;
                if (!playerStats) {
                    playerStats = [];
                    player.stats = playerStats;
                }
                playerStats.push(stats);
            }
        });
        const playersArray: IPlayer[] = [];
        for (const key in players) {
            const player = players[key];
            if (player.name && player.team) {
                playersArray.push(player);
            }
        }
        return playersArray;
    }

    private parseSalary(salary: string): number {
        if (salary) {
            salary = salary.trim().replace("$", "").replace(",", "");
            if (salary !== "N/A") {
                return utils.coerceInt(salary);
            }
        }
        return 0;
    }
}
