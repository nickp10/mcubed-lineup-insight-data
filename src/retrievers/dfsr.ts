/// <reference path="../../typings/index.d.ts" />

import { IDataRetriever, ISiteDataRetriever, IPlayer, IPlayerStats } from "../interfaces";
import PlayerFactory from "../playerFactory";
import * as utils from "../utils";

interface IIndexMapping {
	nameIndex: number;
	teamIndex: number;
	pointsIndex: number;
	salaryIndex: number;
}

export default class DFSR implements IDataRetriever {
	// URLs for DraftKings data
	static draftKingsMLBSiteURL = "/data/baseball.draft_kings.csv";
	static draftKingsNBASiteURL = "/data/basketball.draft_kings.csv";
	static draftKingsNFLSiteURL = "/data/football.draft_kings.csv";
	static draftKingsNHLSiteURL = "/data/hockey.draft_kings.csv";

	// URLs for FanDuel data
	static fanDuelMLBSiteURL = "/data/baseball.fan_duel.csv";
	static fanDuelNBASiteURL = "/data/basketball.fan_duel.csv";
	static fanDuelNFLSiteURL = "/data/football.fan_duel.csv";
	static fanDuelNHLSiteURL = "/data/hockey.fan_duel.csv";

	// URLs for Yahoo data
	static yahooMLBSiteURL = "/data/baseball.yahoo.csv";
	static yahooNBASiteURL = "/data/basketball.yahoo.csv";
	static yahooNFLSiteURL = "/data/football.yahoo.csv";
	static yahooNHLSiteURL = "/data/hockey.yahoo.csv";

	// Indices for the sports
	static mlbIndices: IIndexMapping = {
		nameIndex: 1,
		teamIndex: 10,
		pointsIndex: 2,
		salaryIndex: 3
	};
	static nbaIndices: IIndexMapping = {
		nameIndex: 1,
		teamIndex: 7,
		pointsIndex: 2,
		salaryIndex: 3
	};
	static nflIndices: IIndexMapping = {
		nameIndex: 1,
		teamIndex: 2,
		pointsIndex: 4,
		salaryIndex: 6
	};
	static nhlIndices: IIndexMapping = {
		nameIndex: 1,
		teamIndex: 6,
		pointsIndex: 2,
		salaryIndex: 4
	};

	draftKings = {
		mlb: (playerFactory: PlayerFactory) => this.getData(playerFactory, DFSR.draftKingsMLBSiteURL, DFSR.mlbIndices),
		nba: (playerFactory: PlayerFactory) => this.getData(playerFactory, DFSR.draftKingsNBASiteURL, DFSR.nbaIndices),
		nfl: (playerFactory: PlayerFactory) => this.getData(playerFactory, DFSR.draftKingsNFLSiteURL, DFSR.nflIndices),
		nhl: (playerFactory: PlayerFactory) => this.getData(playerFactory, DFSR.draftKingsNHLSiteURL, DFSR.nhlIndices)
	};

	fanDuel = {
		mlb: (playerFactory: PlayerFactory) => this.getData(playerFactory, DFSR.fanDuelMLBSiteURL, DFSR.mlbIndices),
		nba: (playerFactory: PlayerFactory) => this.getData(playerFactory, DFSR.fanDuelNBASiteURL, DFSR.nbaIndices),
		nfl: (playerFactory: PlayerFactory) => this.getData(playerFactory, DFSR.fanDuelNFLSiteURL, DFSR.nflIndices),
		nhl: (playerFactory: PlayerFactory) => this.getData(playerFactory, DFSR.fanDuelNHLSiteURL, DFSR.nhlIndices)
	};

	yahoo = {
		mlb: (playerFactory: PlayerFactory) => this.getData(playerFactory, DFSR.yahooMLBSiteURL, DFSR.mlbIndices),
		nba: (playerFactory: PlayerFactory) => this.getData(playerFactory, DFSR.yahooNBASiteURL, DFSR.nbaIndices),
		nfl: (playerFactory: PlayerFactory) => this.getData(playerFactory, DFSR.yahooNFLSiteURL, DFSR.nflIndices),
		nhl: (playerFactory: PlayerFactory) => this.getData(playerFactory, DFSR.yahooNHLSiteURL, DFSR.nhlIndices)
	};

	getData(playerFactory: PlayerFactory, siteURL: string, indices: IIndexMapping): PromiseLike<IPlayer[]> {
		return utils.sendHttpsRequest({
			hostname: "www.dailyfantasysportsrankings.com",
			path: siteURL,
			method: "GET"
		}).then((dataResp) => {
			return this.parsePlayers(playerFactory, dataResp.body, indices);
		});
	}

	parsePlayers(playerFactory: PlayerFactory, data: string, indices: IIndexMapping): IPlayer[] {
		if (data && indices) {
			return data.split(/\r?\n/).map(line => {
				if (line) {
					const parts = line.split(/,/);
					if (parts && indices.nameIndex < parts.length && indices.teamIndex < parts.length && indices.pointsIndex < parts.length && indices.salaryIndex < parts.length) {
						const name = parts[indices.nameIndex];
						const team = parts[indices.teamIndex];
						const salary = parseInt(parts[indices.salaryIndex]);
						const player = playerFactory.createPlayer(name, team, salary);
						player.stats = [
							{
								source: "DailyFantasySportsRankings",
								projectedPoints: parseFloat(parts[indices.pointsIndex])
							}
						];
						return player;
					}
				}
				return undefined;
			}).filter(p => !!p);
		}
		return undefined;
	}
}
