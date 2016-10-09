/// <reference path="../../typings/index.d.ts" />

import { IDataRetriever, ISiteDataRetriever, IPlayer, IPlayerStats } from "../interfaces";
import * as Promise from "promise";
import * as utils from "../utils";

interface IIndexMapping {
	nameIndex: number;
	teamIndex: number;
	pointsIndex: number;
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
		pointsIndex: 2
	};
	static nbaIndices: IIndexMapping = {
		nameIndex: 1,
		teamIndex: 7,
		pointsIndex: 2
	};
	static nflIndices: IIndexMapping = {
		nameIndex: 1,
		teamIndex: 2,
		pointsIndex: 4
	};
	static nhlIndices: IIndexMapping = {
		nameIndex: 1,
		teamIndex: 6,
		pointsIndex: 2
	};

	draftKings = {
		mlb: () => this.getData(DFSR.draftKingsMLBSiteURL, DFSR.mlbIndices),
		nba: () => this.getData(DFSR.draftKingsNBASiteURL, DFSR.nbaIndices),
		nfl: () => this.getData(DFSR.draftKingsNFLSiteURL, DFSR.nflIndices),
		nhl: () => this.getData(DFSR.draftKingsNHLSiteURL, DFSR.nhlIndices)
	};

	fanDuel = {
		mlb: () => this.getData(DFSR.fanDuelMLBSiteURL, DFSR.mlbIndices),
		nba: () => this.getData(DFSR.fanDuelNBASiteURL, DFSR.nbaIndices),
		nfl: () => this.getData(DFSR.fanDuelNFLSiteURL, DFSR.nflIndices),
		nhl: () => this.getData(DFSR.fanDuelNHLSiteURL, DFSR.nhlIndices)
	};

	yahoo = {
		mlb: () => this.getData(DFSR.yahooMLBSiteURL, DFSR.mlbIndices),
		nba: () => this.getData(DFSR.yahooNBASiteURL, DFSR.nbaIndices),
		nfl: () => this.getData(DFSR.yahooNFLSiteURL, DFSR.nflIndices),
		nhl: () => this.getData(DFSR.yahooNHLSiteURL, DFSR.nhlIndices)
	};

	getData(siteURL: string, indices: IIndexMapping): Promise.IThenable<IPlayer[]> {
		return utils.sendHttpsRequest({
			hostname: "www.dailyfantasysportsrankings.com",
			path: siteURL,
			method: "GET"
		}).then((dataResp) => {
			return this.parsePlayers(dataResp.body, indices);
		});
	}

	parsePlayers(data: string, indices: IIndexMapping): IPlayer[] {
		if (data && indices) {
			return data.split(/\r?\n/).map(line => {
				if (line) {
					const parts = line.split(/,/);
					if (parts && indices.nameIndex < parts.length && indices.teamIndex < parts.length && indices.pointsIndex < parts.length) {
						const name = parts[indices.nameIndex].replace(" - Start", "");
						const team = parts[indices.teamIndex];
						const player = utils.createPlayer(name, team);
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
