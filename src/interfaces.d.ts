/// <reference path="../typings/index.d.ts" />

import * as http from "http";
import PlayerFactory from "./playerFactory";
import * as Promise from "promise";

export interface IIncomingMessage extends http.IncomingMessage {
	body?: string;
}

export interface IDataRetriever {
	draftKings?: ISiteDataRetriever;
	fanDuel?: ISiteDataRetriever;
	yahoo?: ISiteDataRetriever;
}

export interface ISiteDataRetriever {
	mlb: (playerFactory: PlayerFactory) => Promise.IThenable<IPlayer[]>;
	nba: (playerFactory: PlayerFactory) => Promise.IThenable<IPlayer[]>;
	nfl: (playerFactory: PlayerFactory) => Promise.IThenable<IPlayer[]>;
	nhl: (playerFactory: PlayerFactory) => Promise.IThenable<IPlayer[]>;
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
