import * as http from "http";
import PlayerFactory from "./playerFactory";

export interface IIncomingMessage extends http.IncomingMessage {
	body?: string;
}

export interface IDataRetriever {
	draftKings?: ISiteDataRetriever;
	fanDuel?: ISiteDataRetriever;
	yahoo?: ISiteDataRetriever;
}

export interface ISiteDataRetriever {
	mlb: (playerFactory: PlayerFactory) => PromiseLike<IPlayer[]>;
	nba: (playerFactory: PlayerFactory) => PromiseLike<IPlayer[]>;
	nfl: (playerFactory: PlayerFactory) => PromiseLike<IPlayer[]>;
	nhl: (playerFactory: PlayerFactory) => PromiseLike<IPlayer[]>;
}

export interface IPlayer {
	battingOrder?: string;
	isStarter?: boolean;
	name: string;
	team: string;
	position?: string;
	salary: number;
	stats?: IPlayerStats[];
}

export interface IPlayerStats {
	source: string;
	projectedCeiling?: number;
	projectedFloor?: number;
	projectedPoints?: number;
	recentAveragePoints?: number;
	seasonAveragePoints?: number;
}

export interface IContestRetriever {
	contests: () => PromiseLike<IContest[]>;
}

export interface IContest {
	contestType: string;
	games?: IGame[];
	ID: string;
	label: string;
	maxPlayersPerTeam?: number;
	maxSalary?: number;
	playerDataLastUpdateTime?: Date;
	playerDataNextUpdateTime?: Date;
	positions?: string[];
	sport: string;
	startTime?: Date;
}

export interface IFanDuelContest extends IContest {
	contestURL?: string;
	playersURL?: string;
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
