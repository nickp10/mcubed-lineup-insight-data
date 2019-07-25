import { ITeamInsight, ITeamInsightRetriever, ContestType, Sport } from "../interfaces";
import PlayerFactory from "../playerFactory";
import * as cheerio from "cheerio";
import utils from "../utils";

export default class RGTeamInsight implements ITeamInsightRetriever {
    async teamInsight(contestType: ContestType, sport: Sport): Promise<ITeamInsight[]> {
        const playerFactory = new PlayerFactory(sport);
        switch (contestType) {
            case ContestType.DraftKings:
                switch (sport) {
                    case Sport.MLB:
                        return await this.getData(playerFactory, "draftkings", "mlb");
                    case Sport.NBA:
                        return await this.getData(playerFactory, "draftkings", "nba");
                    case Sport.NFL:
                        return await this.getData(playerFactory, "draftkings", "nfl");
                    case Sport.NHL:
                        return await this.getData(playerFactory, "draftkings", "nhl");
                }
                break;
            case ContestType.FanDuel:
                switch (sport) {
                    case Sport.MLB:
                        return await this.getData(playerFactory, "fanduel", "mlb");
                    case Sport.NBA:
                        return await this.getData(playerFactory, "fanduel", "nba");
                    case Sport.NFL:
                        return await this.getData(playerFactory, "fanduel", "nfl");
                    case Sport.NHL:
                        return await this.getData(playerFactory, "fanduel", "nhl");
                }
                break;
            case ContestType.Yahoo:
                switch (sport) {
                    case Sport.MLB:
                        return await this.getData(playerFactory, "yahoo", "mlb");
                    case Sport.NBA:
                        return await this.getData(playerFactory, "yahoo", "nba");
                    case Sport.NFL:
                        return await this.getData(playerFactory, "yahoo", "nfl");
                    case Sport.NHL:
                        return await this.getData(playerFactory, "yahoo", "nhl");
                }
                break;
        }
        throw new Error("An unknown contest type or sport was specified");
    }

    private async getData(playerFactory: PlayerFactory, contest: string, sport: string): Promise<ITeamInsight[]> {
        return utils.sendHttpsRequest({
            hostname: "rotogrinders.com",
            path: `/lineups/${sport}?site=${contest}`,
            method: "GET"
        }).then((dataResp) => {
            return this.parseTeamInsight(playerFactory, dataResp.body, sport);
        });
    }

    parseTeamInsight(playerFactory: PlayerFactory, data: string, sport: string): ITeamInsight[] {
        return this.parsePlayersCheerio(playerFactory, cheerio.load(data), sport);
    }

    private parsePlayersCheerio(playerFactory: PlayerFactory, $: CheerioStatic, sport: string): ITeamInsight[] {
        return [];
    }
}
