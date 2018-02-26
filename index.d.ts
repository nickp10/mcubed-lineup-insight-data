declare module 'mcubed-lineup-insight-data/build/playerFactory' {
	import { IPlayer, Sport } from 'mcubed-lineup-insight-data/build/interfaces';
export default class PlayerFactory {
    static nameTeamRegex: RegExp;
    static nameTeamRegexNameGroup: number;
    static nameTeamRegexTeamGroup: number;
    static alternateTeamsBySport: Map<Sport, Map<string, string>>;
    static nflCityToMascot: {
        "Arizona": string;
        "Atlanta": string;
        "Baltimore": string;
        "Buffalo": string;
        "Carolina": string;
        "Chicago": string;
        "Cincinnati": string;
        "Cleveland": string;
        "Dallas": string;
        "Denver": string;
        "Detroit": string;
        "Green Bay": string;
        "Houston": string;
        "Indianapolis": string;
        "Jacksonville": string;
        "Kansas City": string;
        "Los Angeles": string;
        "Miami": string;
        "Minnesota": string;
        "New England": string;
        "New Orleans": string;
        "Oakland": string;
        "Philadelphia": string;
        "Pittsburgh": string;
        "San Diego": string;
        "San Francisco": string;
        "Seattle": string;
        "Tampa Bay": string;
        "Tennessee": string;
        "Washington": string;
    };
    alternateTeams: Map<string, string>;
    constructor(sport: Sport);
    createPlayerCombinedNameTeam(nameTeam: string, salary: number): IPlayer;
    updatePlayerCombinedNameTeam(player: IPlayer, nameTeam: string, salary: number): void;
    createPlayer(name?: string, team?: string, salary?: number): IPlayer;
    updatePlayer(player: IPlayer, name?: string, team?: string, salary?: number): void;
    normalizeNFLName(name: string): string;
}

}
declare module 'mcubed-lineup-insight-data/build/interfaces' {
	/// <reference types="node" />
import * as http from "http";
export interface IIncomingMessage extends http.IncomingMessage {
    body?: string;
}
export interface IPlayerCardRetriever {
    contestType: ContestType;
    playerCard: (contestID: string, playerID: string) => PromiseLike<IPlayerCard>;
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
    playerInsight: (contest: ContestType, sport: Sport) => PromiseLike<IPlayer[]>;
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
    contestList: (sport: Sport) => PromiseLike<IContest[]>;
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
    positions?: string[];
    sport: Sport;
    startTime?: Date;
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
    Yahoo = 3,
}
export enum DataType {
    ContestList = 1,
    PlayerCard = 2,
    PlayerInsight = 3,
    TeamInsight = 4,
}
export enum InjuryType {
    Out = 1,
    Possible = 2,
    Probable = 3,
}
export enum NewsStatus {
    Breaking = 1,
    Recent = 2,
    None = 3,
}
export enum Sport {
    MLB = 1,
    NBA = 2,
    NFL = 3,
    NHL = 4,
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
    equalsIgnoreCase(strA: string, strB: string): boolean;
    sendHttpsRequest(request: https.RequestOptions, data?: string): PromiseLike<IIncomingMessage>;
} const utils: Utils;
export default utils;

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
    validate(argDataType: string, argContestType: string, argSport: string, argContestID: string, argPlayerID: string): void;
} const args: Args;
export default args;

}
declare module 'mcubed-lineup-insight-data/build/retrievers/dfsr' {
	import { IPlayer, IPlayerInsightRetriever, ContestType, Sport } from 'mcubed-lineup-insight-data/build/interfaces';
import PlayerFactory from 'mcubed-lineup-insight-data/build/playerFactory';
export default class DFSR implements IPlayerInsightRetriever {
    static draftKingsMLBSiteURL: string;
    static draftKingsNBASiteURL: string;
    static draftKingsNFLSiteURL: string;
    static draftKingsNHLSiteURL: string;
    static fanDuelMLBSiteURL: string;
    static fanDuelNBASiteURL: string;
    static fanDuelNFLSiteURL: string;
    static fanDuelNHLSiteURL: string;
    static yahooMLBSiteURL: string;
    static yahooNBASiteURL: string;
    static yahooNFLSiteURL: string;
    static yahooNHLSiteURL: string;
    private static mlbIndices;
    private static nbaIndices;
    private static nflIndices;
    private static nhlIndices;
    playerInsight(contestType: ContestType, sport: Sport): PromiseLike<IPlayer[]>;
    private getData(playerFactory, siteURL, indices);
    private parsePlayersIndices(playerFactory, data, indices);
    parsePlayers(playerFactory: PlayerFactory, data: string, nameIndex: number, teamIndex: number, pointsIndex: number, salaryIndex: number): IPlayer[];
}

}
declare module 'mcubed-lineup-insight-data/build/contestRetrievers/fanDuelContestRetriever' {
	import { IContestListRetriever, IContest, IGame, IPlayer, IPlayerInjury, ITeam, ContestType, NewsStatus, Sport } from 'mcubed-lineup-insight-data/build/interfaces';
export default class FanDuelContestRetriever implements IContestListRetriever {
    static FAN_DUEL_ID_PREFIX: string;
    static MILLIS_IN_DAY: number;
    contestType: ContestType;
    contestList(sport: Sport): PromiseLike<IContest[]>;
    getContestList(sport: Sport): PromiseLike<IContest[]>;
    getContestSpecificData(contest: IContest): PromiseLike<IContest>;
    getContestPlayerList(contest: IContest): PromiseLike<IContest>;
    queryContestSpecificData(contests: IContest[]): PromiseLike<IContest[]>;
    queryContestPlayerList(contest: IContest): PromiseLike<IContest>;
    parseContestList(data: string, sport: Sport): IContest[];
    parseContestSpecificData(fdContest: IContest, contestData: string): void;
    parseGame(contestData: any, gameData: any): IGame;
    parseTeam(contestData: any, teamData: any): ITeam;
    parseContestPlayerList(fdContest: IContest, playerListData: string): void;
    parseBattingOrder(battingOrder: string): string;
    parsePlayerID(id: string): string;
    parseInjuryStatus(injuryStatus: string): IPlayerInjury;
    parseNewsStatus(jsonPlayer: any): NewsStatus;
    attachPlayersToTeams(fdContest: IContest, players: IPlayer[]): void;
    getRawContestID(contest: IContest): string;
}

}
declare module 'mcubed-lineup-insight-data/build/playerCardRetrievers/fanDuelPlayerCardRetriever' {
	import { IPlayerCard, IPlayerCardRetriever, ContestType } from 'mcubed-lineup-insight-data/build/interfaces';
export default class FanDuelPlayerCardRetriever implements IPlayerCardRetriever {
    static FAN_DUEL_ID_PREFIX: string;
    contestType: ContestType;
    playerCard(contestID: string, playerID: string): PromiseLike<IPlayerCard>;
    getPlayerCard(contestID: string, playerID: string): PromiseLike<IPlayerCard>;
    parsePlayerCard(data: string, contestID: string, playerID: string): IPlayerCard;
    parseGameLog(card: IPlayerCard, jsonData: any, player: any, gameLogIDs: any[]): void;
    parseNews(card: IPlayerCard, jsonData: any, newsItemIDs: any[]): void;
    findGame(jsonData: any, gameID: string): any;
    findTeam(jsonData: any, teamID: string): any;
    getRawContestID(id: string): string;
}

}
declare module 'mcubed-lineup-insight-data/build/retrievers/numberFire' {
	/// <reference types="cheerio" />
import { IIncomingMessage, IPlayer, IPlayerInsightRetriever, ContestType, Sport } from 'mcubed-lineup-insight-data/build/interfaces';
import PlayerFactory from 'mcubed-lineup-insight-data/build/playerFactory';
export default class NumberFire implements IPlayerInsightRetriever {
    static fanDuelID: string;
    static draftKingsID: string;
    static yahooID: string;
    static mlbSetSiteURL: string;
    static nbaSetSiteURL: string;
    static nflSetSiteURL: string;
    static nhlSetSiteURL: string;
    static mlbDataSiteURLs: string[];
    static nbaDataSiteURLs: string[];
    static nflDataSiteURLs: string[];
    static nhlDataSiteURLs: string[];
    playerInsight(contestType: ContestType, sport: Sport): PromiseLike<IPlayer[]>;
    getData(playerFactory: PlayerFactory, setSiteURL: string, siteID: string, dataSiteURLs: string[]): PromiseLike<IPlayer[]>;
    getDataForURL(playerFactory: PlayerFactory, dataSiteURL: string, cookieHeaders: string[]): PromiseLike<IPlayer[]>;
    parseData(playerFactory: PlayerFactory, dataSiteURLs: string[], setSiteResp: IIncomingMessage): PromiseLike<IPlayer[]>;
    parsePlayers(playerFactory: PlayerFactory, $: CheerioStatic): IPlayer[];
    parseSalary(salary: string): number;
}

}
declare module 'mcubed-lineup-insight-data/build/retrievers/rotogrinders/projections' {
	import { IPlayer, IPlayerInsightRetriever, ContestType, Sport } from 'mcubed-lineup-insight-data/build/interfaces';
import PlayerFactory from 'mcubed-lineup-insight-data/build/playerFactory';
export default class RGProjections implements IPlayerInsightRetriever {
    static dataRegex: RegExp;
    static dataRegexGroup: number;
    playerInsight(contestType: ContestType, sport: Sport): PromiseLike<IPlayer[]>;
    getData(playerFactory: PlayerFactory, contest: string, ...pages: string[]): PromiseLike<IPlayer[]>;
    parsePlayers(playerFactory: PlayerFactory, data: string): IPlayer[];
}

}
declare module 'mcubed-lineup-insight-data/build/retrievers/rotogrinders/recent' {
	import { IPlayer, IPlayerInsightRetriever, ContestType, Sport } from 'mcubed-lineup-insight-data/build/interfaces';
import PlayerFactory from 'mcubed-lineup-insight-data/build/playerFactory';
export default class RGRecent implements IPlayerInsightRetriever {
    static dataRegex: RegExp;
    static dataRegexGroup: number;
    playerInsight(contestType: ContestType, sport: Sport): PromiseLike<IPlayer[]>;
    getData(playerFactory: PlayerFactory, ...pages: string[]): PromiseLike<IPlayer[]>;
    parsePlayers(playerFactory: PlayerFactory, data: string): IPlayer[];
}

}
declare module 'mcubed-lineup-insight-data/build/retrievers/rotogrinders/starting' {
	/// <reference types="cheerio" />
import { IPlayer, IPlayerInsightRetriever, ContestType, Sport } from 'mcubed-lineup-insight-data/build/interfaces';
import PlayerFactory from 'mcubed-lineup-insight-data/build/playerFactory';
export default class RGStarting implements IPlayerInsightRetriever {
    playerInsight(contestType: ContestType, sport: Sport): PromiseLike<IPlayer[]>;
    getData(playerFactory: PlayerFactory, contest: string, sport: string): PromiseLike<IPlayer[]>;
    parsePlayers(playerFactory: PlayerFactory, $: CheerioStatic, sport: string): IPlayer[];
    parsePlayersForLineup(playerFactory: PlayerFactory, players: IPlayer[], lineup: Cheerio, team: string, sport: string): void;
    parseSalary(salary: string): number;
    createPlayer(playerFactory: PlayerFactory, playerItem: Cheerio, playerName: Cheerio, sport: string, team: string, salary: number): IPlayer;
    parseBattingOrder(startingOrder: string): string;
}

}
declare module 'mcubed-lineup-insight-data/build/data' {
	import { IContest, IContestListRetriever, IPlayer, IPlayerCard, IPlayerCardRetriever, IPlayerInsightRetriever, ContestType, Sport } from 'mcubed-lineup-insight-data/build/interfaces';
export class Data {
    contestListRetrievers: IContestListRetriever[];
    playerCardRetrievers: IPlayerCardRetriever[];
    playerInsightRetrievers: IPlayerInsightRetriever[];
    getContestList(contestType: ContestType, sport: Sport): PromiseLike<IContest[]>;
    getPlayerCard(contestType: ContestType, contestID: string, playerID: string): PromiseLike<IPlayerCard>;
    getPlayerInsight(contestType: ContestType, sport: Sport): PromiseLike<IPlayer[]>;
} const insightData: Data;
export default insightData;

}
declare module 'mcubed-lineup-insight-data/build/cli' {
	export {};

}
declare module 'mcubed-lineup-insight-data' {
	export {default} from 'mcubed-lineup-insight-data/build/data';
	}
