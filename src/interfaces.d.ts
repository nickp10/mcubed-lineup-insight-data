/// <reference path="../typings/index.d.ts" />

import * as Promise from "promise";

export interface IDataRetriever {
	draftKings?: ISiteDataRetriever;
	fanDuel?: ISiteDataRetriever;
	yahoo?: ISiteDataRetriever;
}

export interface ISiteDataRetriever {
	mlb: () => Promise.IThenable<IPlayer[]>;
	nba: () => Promise.IThenable<IPlayer[]>;
	nfl: () => Promise.IThenable<IPlayer[]>;
	nhl: () => Promise.IThenable<IPlayer[]>;
}

export interface IPlayer {
	battingOrder?: string;
	isStarted?: boolean;
	name: string;
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
