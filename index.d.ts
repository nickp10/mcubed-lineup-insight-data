declare module 'mcubed-lineup-insight-data/build/interfaces' {
    /// <reference types="node" />
import * as http from "http";
export interface IIncomingMessage extends http.IncomingMessage {
    body?: string;
}
export interface IPlayerCardRetriever {
    contestType: ContestType;
    playerCard: (contestID: string, playerID: string) => Promise<IPlayerCard>;
}
export interface IPlayerCard {
    gameLog: IPlayerCardGameStats[];
    news: IPlayerCardArticle[];
}
export interface IPlayerCardArticle {
    date: Date;
    details: string;
    summary: string;
}
export interface IPlayerCardGameStats {
    date: Date;
    opponent: string;
    points?: number;
}
export interface IPlayerInsightRetriever {
    playerInsight: (contest: ContestType, sport: Sport) => Promise<IPlayer[]>;
}
export interface IPlayer {
    battingOrder?: string;
    ID?: string;
    injury?: IPlayerInjury;
    isProbablePitcher?: boolean;
    isStarter?: boolean;
    name: string;
    newsStatus?: NewsStatus;
    position?: string;
    salary: number;
    stats?: IPlayerStats[];
    team: string;
}
export interface IPlayerInjury {
    display: string;
    injuryType: InjuryType;
}
export interface IPlayerStats {
    source: string;
    projectedCeiling?: number;
    projectedFloor?: number;
    projectedPoints?: number;
    recentAveragePoints?: number;
    seasonAveragePoints?: number;
}
export interface IContestListRetriever {
    contestList: (sport: Sport) => Promise<IContest[]>;
    contestType: ContestType;
}
export interface IContest {
    contestType: ContestType;
    games?: IGame[];
    ID: string;
    label: string;
    maxPlayersPerTeam?: number;
    maxSalary?: number;
    playerDataLastUpdateTime?: Date;
    playerDataNextUpdateTime?: Date;
    positions?: IContestPosition[];
    sport: Sport;
    startTime?: Date;
}
export interface IContestPosition {
    eligiblePlayerPositions: string[];
    label: string;
}
export interface IGame {
    awayTeam: ITeam;
    homeTeam: ITeam;
    startTime: Date;
}
export interface ITeam {
    code: string;
    fullName: string;
    players?: IPlayer[];
}
export enum ContestType {
    DraftKings = 1,
    FanDuel = 2,
    Yahoo = 3
}
export enum DataType {
    ContestList = 1,
    PlayerCard = 2,
    PlayerInsight = 3,
    TeamInsight = 4
}
export enum InjuryType {
    Out = 1,
    Possible = 2,
    Probable = 3
}
export enum NewsStatus {
    Breaking = 1,
    Recent = 2,
    None = 3
}
export enum Sport {
    MLB = 1,
    NBA = 2,
    NFL = 3,
    NHL = 4
}

}
declare module 'mcubed-lineup-insight-data/build/utils' {
    /// <reference types="node" />
import { IIncomingMessage, ContestType, DataType, Sport } from 'mcubed-lineup-insight-data/build/interfaces';
import * as https from "https";
export class Utils {
    flattenArray<T>(arr: T | T[] | T[][]): T[];
    validContestTypes(): string[];
    validDataTypes(): string[];
    validSports(): string[];
    coerceContestType(contestType: string): ContestType;
    coerceDataType(data: string): DataType;
    coerceSport(sport: string): Sport;
    coerceInt(value: string): number;
    coerceFloat(value: string): number;
    coerceError(error: any): Error;
    equalsIgnoreCase(strA: string, strB: string): boolean;
    sendHttpsRequest(request: https.RequestOptions, data?: string): Promise<IIncomingMessage>;
} const _default: Utils;
export default _default;

}
declare module 'mcubed-lineup-insight-data/build/args' {
    import { ContestType, DataType, Sport } from 'mcubed-lineup-insight-data/build/interfaces';
export class Args {
    dataType: DataType;
    contestType: ContestType;
    sport: Sport;
    contestID: string;
    playerID: string;
    constructor();
    private validate;
} const _default: Args;
export default _default;

}
declare module 'mcubed-lineup-insight-data/build/playerFactory' {
    import { IPlayer, Sport } from 'mcubed-lineup-insight-data/build/interfaces';
export default class PlayerFactory {
    private static nameTeamRegex;
    private static nameTeamRegexNameGroup;
    private static nameTeamRegexTeamGroup;
    private static alternateTeamsBySport;
    private static nflCityToMascot;
    private alternateTeams;
    constructor(sport: Sport);
    createPlayerCombinedNameTeam(nameTeam: string, salary: number): IPlayer;
    updatePlayerCombinedNameTeam(player: IPlayer, nameTeam: string, salary: number): void;
    createPlayer(name?: string, team?: string, salary?: number): IPlayer;
    updatePlayer(player: IPlayer, name?: string, team?: string, salary?: number): void;
    normalizeNFLName(name: string): string;
}

}
declare module 'mcubed-lineup-insight-data/build/retrievers/dfsr' {
    import { IPlayer, IPlayerInsightRetriever, ContestType, Sport } from 'mcubed-lineup-insight-data/build/interfaces';
import PlayerFactory from 'mcubed-lineup-insight-data/build/playerFactory';
export interface ICSVOptions {
    isFirstLineHeader: boolean;
    nameIndex: number;
    teamIndex: number;
    pointsIndex: number;
    salaryIndex: number;
    floorIndex?: number;
    ceilingIndex?: number;
}
export default class DFSR implements IPlayerInsightRetriever {
    private static draftKingsMLBSiteURL;
    private static draftKingsNBASiteURL;
    private static draftKingsNFLSiteURL;
    private static draftKingsNHLSiteURL;
    private static fanDuelMLBSiteURL;
    private static fanDuelNBASiteURL;
    private static fanDuelNFLSiteURL;
    private static fanDuelNHLSiteURL;
    private static yahooMLBSiteURL;
    private static yahooNBASiteURL;
    private static yahooNFLSiteURL;
    private static yahooNHLSiteURL;
    static draftKingsMLBCSVOptions: ICSVOptions;
    static draftKingsNBACSVOptions: ICSVOptions;
    static draftKingsNFLCSVOptions: ICSVOptions;
    static draftKingsNHLCSVOptions: ICSVOptions;
    static fanDuelMLBCSVOptions: ICSVOptions;
    static fanDuelNBACSVOptions: ICSVOptions;
    static fanDuelNFLCSVOptions: ICSVOptions;
    static fanDuelNHLCSVOptions: ICSVOptions;
    static yahooMLBCSVOptions: ICSVOptions;
    static yahooNBACSVOptions: ICSVOptions;
    static yahooNFLCSVOptions: ICSVOptions;
    static yahooNHLCSVOptions: ICSVOptions;
    playerInsight(contestType: ContestType, sport: Sport): Promise<IPlayer[]>;
    private getData;
    private parsePlayersIndices;
    parsePlayers(playerFactory: PlayerFactory, data: string, csvOptions: ICSVOptions): IPlayer[];
}

}
declare module 'mcubed-lineup-insight-data/build/contestRetrievers/fanDuelContestRetriever' {
    import { IContestListRetriever, IContest, ContestType, Sport } from 'mcubed-lineup-insight-data/build/interfaces';
export default class FanDuelContestRetriever implements IContestListRetriever {
    private static FAN_DUEL_ID_PREFIX;
    private static MILLIS_IN_DAY;
    contestType: ContestType;
    contestList(sport: Sport): Promise<IContest[]>;
    private getContestList;
    private getContestSpecificData;
    private getContestPlayerList;
    private queryContestSpecificData;
    private queryContestPlayerList;
    parseContestList(data: string, sport: Sport): IContest[];
    parseContestSpecificData(fdContest: IContest, contestData: string): void;
    private parseGame;
    private parseTeam;
    parseContestPlayerList(fdContest: IContest, playerListData: string): void;
    private parseBattingOrder;
    private parsePlayerID;
    private parseInjuryStatus;
    private parseNewsStatus;
    private attachPlayersToTeams;
    private getRawContestID;
}

}
declare module 'mcubed-lineup-insight-data/build/playerCardRetrievers/fanDuelPlayerCardRetriever' {
    import { IPlayerCard, IPlayerCardRetriever, ContestType } from 'mcubed-lineup-insight-data/build/interfaces';
export default class FanDuelPlayerCardRetriever implements IPlayerCardRetriever {
    private static FAN_DUEL_ID_PREFIX;
    contestType: ContestType;
    playerCard(contestID: string, playerID: string): Promise<IPlayerCard>;
    private getPlayerCard;
    parsePlayerCard(data: string, contestID: string, playerID: string): IPlayerCard;
    private parseGameLog;
    private parseNews;
    private findGame;
    private findTeam;
    private getRawContestID;
}

}
declare module 'mcubed-lineup-insight-data/build/retrievers/numberFire' {
    import { IIncomingMessage, IPlayer, IPlayerInsightRetriever, ContestType, Sport } from 'mcubed-lineup-insight-data/build/interfaces';
import PlayerFactory from 'mcubed-lineup-insight-data/build/playerFactory';
export default class NumberFire implements IPlayerInsightRetriever {
    private static fanDuelID;
    private static draftKingsID;
    private static yahooID;
    private static mlbSetSiteURL;
    private static nbaSetSiteURL;
    private static nflSetSiteURL;
    private static nhlSetSiteURL;
    private static mlbDataSiteURLs;
    private static nbaDataSiteURLs;
    private static nflDataSiteURLs;
    private static nhlDataSiteURLs;
    playerInsight(contestType: ContestType, sport: Sport): Promise<IPlayer[]>;
    private getData;
    private getDataForURL;
    parseData(playerFactory: PlayerFactory, dataSiteURLs: string[], setSiteResp: IIncomingMessage): Promise<IPlayer[]>;
    parsePlayers(playerFactory: PlayerFactory, data: string): IPlayer[];
    private parsePlayersCheerio;
    private parseSalary;
}

}
declare module 'mcubed-lineup-insight-data/build/retrievers/rotogrinders/projections' {
    import { IPlayer, IPlayerInsightRetriever, ContestType, Sport } from 'mcubed-lineup-insight-data/build/interfaces';
import PlayerFactory from 'mcubed-lineup-insight-data/build/playerFactory';
export default class RGProjections implements IPlayerInsightRetriever {
    private static dataRegex;
    private static dataRegexGroup;
    playerInsight(contestType: ContestType, sport: Sport): Promise<IPlayer[]>;
    private getData;
    parsePlayers(playerFactory: PlayerFactory, data: string): IPlayer[];
}

}
declare module 'mcubed-lineup-insight-data/build/retrievers/rotogrinders/recent' {
    import { IPlayer, IPlayerInsightRetriever, ContestType, Sport } from 'mcubed-lineup-insight-data/build/interfaces';
import PlayerFactory from 'mcubed-lineup-insight-data/build/playerFactory';
export default class RGRecent implements IPlayerInsightRetriever {
    private static dataRegex;
    private static dataRegexGroup;
    playerInsight(contestType: ContestType, sport: Sport): Promise<IPlayer[]>;
    private getData;
    parsePlayers(playerFactory: PlayerFactory, data: string): IPlayer[];
}

}
declare module 'mcubed-lineup-insight-data/build/retrievers/rotogrinders/starting' {
    import { IPlayer, IPlayerInsightRetriever, ContestType, Sport } from 'mcubed-lineup-insight-data/build/interfaces';
import PlayerFactory from 'mcubed-lineup-insight-data/build/playerFactory';
export default class RGStarting implements IPlayerInsightRetriever {
    playerInsight(contestType: ContestType, sport: Sport): Promise<IPlayer[]>;
    private getData;
    parsePlayers(playerFactory: PlayerFactory, data: string, sport: string): IPlayer[];
    private parsePlayersCheerio;
    private parsePlayersForLineup;
    private parseSalary;
    private createPlayer;
    private parseBattingOrder;
}

}
declare module 'mcubed-lineup-insight-data/build/data' {
    import "babel-polyfill";
import { IContest, IPlayer, IPlayerCard, ContestType, Sport } from 'mcubed-lineup-insight-data/build/interfaces';
export class Data {
    private contestListRetrievers;
    private playerCardRetrievers;
    private playerInsightRetrievers;
    getContestList(contestType?: ContestType, sport?: Sport): Promise<IContest[]>;
    getPlayerCard(contestType: ContestType, contestID: string, playerID: string): Promise<IPlayerCard>;
    getPlayerInsight(contestType: ContestType, sport: Sport): Promise<IPlayer[]>;
} const _default: Data;
export default _default;

}
declare module 'mcubed-lineup-insight-data' {
    export {default} from 'mcubed-lineup-insight-data/build/data';
    }
