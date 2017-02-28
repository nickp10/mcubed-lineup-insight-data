/// <reference path="../typings/index.d.ts" />

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
