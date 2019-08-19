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
    ID?: string;
    injury?: IPlayerInjury;
    isStarter?: boolean;
    mlbSpecific?: IPlayerMLBSpecific;
    name: string;
    newsStatus?: NewsStatus;
    position?: string;
    salary: number;
    stats?: IPlayerStats[];
    team: string;
    thumbnailURL?: string;
}

export interface IPlayerMLBSpecific {
    battingOrder?: string;
    handednessBat?: string;
    handednessThrow?: string;
    isProbablePitcher?: boolean;
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

export interface ITeamInsightRetriever {
    teamInsight: (contestType: ContestType, sport: Sport) => Promise<ITeamInsight[]>;
}

export interface ITeamInsight {
    code: string;
    fullName: string;
    pointsAllowedPerPosition?: IPositionPoints[];
}

export interface IPositionPoints {
    position: string;
    points: number;
    source: string;
}

export enum ContestType {
    DraftKings = 1,
    FanDuel,
    Yahoo
}

export enum DataType {
    ContestList = 1,
    PlayerCard,
    PlayerInsight,
    TeamInsight
}

export enum InjuryType {
    Out = 1,
    Possible,
    Probable
}

export enum NewsStatus {
    Breaking = 1,
    Recent,
    None
}

export enum Sport {
    MLB = 1,
    NBA,
    NFL,
    NHL
}
