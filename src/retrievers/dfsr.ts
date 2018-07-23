import { IPlayer, IPlayerInsightRetriever, IPlayerStats, ContestType, Sport } from "../interfaces";
import PlayerFactory from "../playerFactory";
import utils from "../utils";

interface ICSVOptions {
    isFirstLineHeader: boolean;
    nameIndex: number;
    teamIndex: number;
    pointsIndex: number;
    salaryIndex: number;
    floorIndex?: number;
    ceilingIndex?: number;
}

export default class DFSR implements IPlayerInsightRetriever {
    // URLs for DraftKings data
    private static draftKingsMLBSiteURL = "/data/fantasydata.mlb.csv";
    private static draftKingsNBASiteURL = "/data/basketball.DFSR1.csv";
    private static draftKingsNFLSiteURL = "/data/football.draft_kings.csv";
    private static draftKingsNHLSiteURL = "/data/hockey.DFSR.csv";

    // URLs for FanDuel data
    private static fanDuelMLBSiteURL = "/data/fantasydata.mlb.csv";
    private static fanDuelNBASiteURL = "/data/basketball.DFSR1.csv";
    private static fanDuelNFLSiteURL = "/data/football.fan_duel.csv";
    private static fanDuelNHLSiteURL = "/data/hockey.DFSR.csv";

    // URLs for Yahoo data
    private static yahooMLBSiteURL = "/data/fantasydata.mlb.csv";
    private static yahooNBASiteURL = "/data/basketball.DFSR1.csv";
    private static yahooNFLSiteURL = "/data/football.yahoo.csv";
    private static yahooNHLSiteURL = "/data/hockey.DFSR.csv";

    // CSV options for MLB
    private static draftKingsMLBCSVOptions: ICSVOptions = {
        isFirstLineHeader: true,
        nameIndex: 1,
        teamIndex: 7,
        pointsIndex: 12,
        salaryIndex: 11,
        floorIndex: 40,
        ceilingIndex: 41
    };
    private static fanDuelMLBCSVOptions: ICSVOptions = {
        isFirstLineHeader: true,
        nameIndex: 1,
        teamIndex: 7,
        pointsIndex: 2,
        salaryIndex: 3,
        floorIndex: 38,
        ceilingIndex: 39
    };
    private static yahooMLBCSVOptions: ICSVOptions = {
        isFirstLineHeader: true,
        nameIndex: 1,
        teamIndex: 7,
        pointsIndex: 14,
        salaryIndex: 13
    };

    // CSV options for NBA
    private static draftKingsNBACSVOptions: ICSVOptions = {
        isFirstLineHeader: true,
        nameIndex: 1,
        teamIndex: 7,
        pointsIndex: 28,
        salaryIndex: 27
    };
    private static fanDuelNBACSVOptions: ICSVOptions = {
        isFirstLineHeader: true,
        nameIndex: 1,
        teamIndex: 7,
        pointsIndex: 2,
        salaryIndex: 3
    };
    private static yahooNBACSVOptions: ICSVOptions = undefined;

    // CSV options for NFL
    private static draftKingsNFLCSVOptions: ICSVOptions = {
        isFirstLineHeader: false,
        nameIndex: 1,
        teamIndex: 2,
        pointsIndex: 4,
        salaryIndex: 6
    };
    private static fanDuelNFLCSVOptions: ICSVOptions = {
        isFirstLineHeader: false,
        nameIndex: 1,
        teamIndex: 2,
        pointsIndex: 4,
        salaryIndex: 6
    };
    private static yahooNFLCSVOptions: ICSVOptions = undefined;

    // CSV options for NHL
    private static draftKingsNHLCSVOptions: ICSVOptions = {
        isFirstLineHeader: true,
        nameIndex: 1,
        teamIndex: 5,
        pointsIndex: 9,
        salaryIndex: 8
    };
    private static fanDuelNHLCSVOptions: ICSVOptions = {
        isFirstLineHeader: true,
        nameIndex: 1,
        teamIndex: 5,
        pointsIndex: 2,
        salaryIndex: 4
    };
    private static yahooNHLCSVOptions: ICSVOptions = undefined;

    async playerInsight(contestType: ContestType, sport: Sport): Promise<IPlayer[]> {
        const playerFactory = new PlayerFactory(sport);
        switch (contestType) {
            case ContestType.DraftKings:
                switch (sport) {
                    case Sport.MLB:
                        return await this.getData(playerFactory, DFSR.draftKingsMLBSiteURL, DFSR.draftKingsMLBCSVOptions);
                    case Sport.NBA:
                        return await this.getData(playerFactory, DFSR.draftKingsNBASiteURL, DFSR.draftKingsNBACSVOptions);
                    case Sport.NFL:
                        return await this.getData(playerFactory, DFSR.draftKingsNFLSiteURL, DFSR.draftKingsNFLCSVOptions);
                    case Sport.NHL:
                        return await this.getData(playerFactory, DFSR.draftKingsNHLSiteURL, DFSR.draftKingsNHLCSVOptions);
                }
                break;
            case ContestType.FanDuel:
                switch (sport) {
                    case Sport.MLB:
                        return await this.getData(playerFactory, DFSR.fanDuelMLBSiteURL, DFSR.fanDuelMLBCSVOptions);
                    case Sport.NBA:
                        return await this.getData(playerFactory, DFSR.fanDuelNBASiteURL, DFSR.fanDuelNBACSVOptions);
                    case Sport.NFL:
                        return await this.getData(playerFactory, DFSR.fanDuelNFLSiteURL, DFSR.fanDuelNFLCSVOptions);
                    case Sport.NHL:
                        return await this.getData(playerFactory, DFSR.fanDuelNHLSiteURL, DFSR.fanDuelNHLCSVOptions);
                }
                break;
            case ContestType.Yahoo:
                switch (sport) {
                    case Sport.MLB:
                        return await this.getData(playerFactory, DFSR.yahooMLBSiteURL, DFSR.yahooMLBCSVOptions);
                    case Sport.NBA:
                        return await this.getData(playerFactory, DFSR.yahooNBASiteURL, DFSR.yahooNBACSVOptions);
                    case Sport.NFL:
                        return await this.getData(playerFactory, DFSR.yahooNFLSiteURL, DFSR.yahooNFLCSVOptions);
                    case Sport.NHL:
                        return await this.getData(playerFactory, DFSR.yahooNHLSiteURL, DFSR.yahooNHLCSVOptions);
                }
                break;
        }
        throw new Error("An unknown contest type or sport was specified");
    }

    private async getData(playerFactory: PlayerFactory, siteURL: string, csvOptions: ICSVOptions): Promise<IPlayer[]> {
        if (!csvOptions) {
            return Promise.resolve<IPlayer[]>(undefined);
        }
        return utils.sendHttpsRequest({
            hostname: "www.dailyfantasysportsrankings.com",
            path: siteURL,
            method: "GET"
        }).then((dataResp) => {
            return this.parsePlayersIndices(playerFactory, dataResp.body, csvOptions);
        });
    }

    private parsePlayersIndices(playerFactory: PlayerFactory, data: string, csvOptions: ICSVOptions): IPlayer[] {
        return this.parsePlayers(playerFactory, data, csvOptions);
    }

    parsePlayers(playerFactory: PlayerFactory, data: string, csvOptions: ICSVOptions): IPlayer[] {
        if (data) {
            const { isFirstLineHeader, nameIndex, teamIndex, pointsIndex, salaryIndex, floorIndex, ceilingIndex } = csvOptions;
            let isFirstLine = true;
            return data.split(/\r?\n/).map(line => {
                if (line) {
                    const isCurrentFirstLine = isFirstLine;
                    isFirstLine = false;
                    if (!isCurrentFirstLine || !isFirstLineHeader) {
                        const parts = line.split(/,/);
                        if (parts && nameIndex < parts.length && teamIndex < parts.length && pointsIndex < parts.length && salaryIndex < parts.length) {
                            const name = parts[nameIndex];
                            const team = parts[teamIndex];
                            const salary = utils.coerceInt(parts[salaryIndex]);
                            const player = playerFactory.createPlayer(name, team, salary);
                            player.stats = [
                                {
                                    source: "DailyFantasySportsRankings",
                                    projectedPoints: utils.coerceFloat(parts[pointsIndex]),
                                    projectedFloor: (floorIndex < parts.length) ? utils.coerceFloat(parts[floorIndex]) : undefined,
                                    projectedCeiling: (ceilingIndex < parts.length) ? utils.coerceFloat(parts[ceilingIndex]) : undefined
                                }
                            ];
                            return player;
                        }
                    }
                }
                return undefined;
            }).filter(p => !!p);
        }
        return undefined;
    }
}
