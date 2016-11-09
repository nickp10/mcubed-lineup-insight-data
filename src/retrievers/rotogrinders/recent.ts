/// <reference path="../../../typings/index.d.ts" />

import { IDataRetriever, ISiteDataRetriever, IPlayer, IPlayerStats } from "../../interfaces";
import * as Promise from "promise";
import * as utils from "../../utils";

export default class RGRecent implements IDataRetriever {
	// Regex for matching the data JSON object in the HTML document
	static dataRegex = /data\s*=\s*(.*?}]);/;
	static dataRegexGroup = 1;

	draftKings = {
		mlb: () => this.getData("mlb-pitcher?site=draftkings&range=4weeks", "mlb-hitter?site=draftkings&range=1week"),
		nba: () => this.getData("nba-player?site=draftkings&range=1week"),
		nfl: () => this.getData("nfl-offense?site=draftkings&range=4weeks", "nfl-defense?site=draftkings&range=4weeks", "nfl-kicker?site=draftkings&range=4weeks"),
		nhl: () => this.getData("nhl-skater?site=draftkings&range=1week", "nhl-goalie?site=draftkings&range=1week")
	};

	fanDuel = {
		mlb: () => this.getData("mlb-pitcher?site=fanduel&range=4weeks", "mlb-hitter?site=fanduel&range=1week"),
		nba: () => this.getData("nba-player?site=fanduel&range=1week"),
		nfl: () => this.getData("nfl-offense?site=fanduel&range=4weeks", "nfl-defense?site=fanduel&range=4weeks", "nfl-kicker?site=fanduel&range=4weeks"),
		nhl: () => this.getData("nhl-skater?site=fanduel&range=1week", "nhl-goalie?site=fanduel&range=1week")
	};

	yahoo = {
		mlb: () => this.getData("mlb-pitcher?site=yahoo&range=4weeks", "mlb-hitter?site=yahoo&range=1week"),
		nba: () => this.getData("nba-player?site=yahoo&range=1week"),
		nfl: () => this.getData("nfl-offense?site=yahoo&range=4weeks", "nfl-defense?site=yahoo&range=4weeks", "nfl-kicker?site=yahoo&range=4weeks"),
		nhl: () => this.getData("nhl-skater?site=yahoo&range=1week", "nhl-goalie?site=yahoo&range=1week")
	};

	getData(...pages: string[]): Promise.IThenable<IPlayer[]> {
		const promises = pages.map((page) => {
			return utils.sendHttpsRequest({
				hostname: "rotogrinders.com",
				path: `/game-stats/${page}`,
				method: "GET"
			}).then((dataResp) => {
				return this.parsePlayers(dataResp.body);
			});
		});
		return Promise.all(promises).then((playersArrays) => {
			return utils.flattenArray<IPlayer>(playersArrays);
		});
	}

	parsePlayers(data: string): IPlayer[] {
		const players: IPlayer[] = [];
		if (data) {
			const dataMatch = data.match(RGRecent.dataRegex);
			if (dataMatch && dataMatch.length >= RGRecent.dataRegexGroup) {
				const json = dataMatch[RGRecent.dataRegexGroup];
				const playersJson = JSON.parse(json);
				if (Array.isArray(playersJson)) {
					playersJson.forEach((playerJson) => {
						const name = playerJson.player;
						const team = playerJson.team;
						const fpts = parseFloat(playerJson.fpts);
						const gp = parseInt(playerJson.gp);
						if (name && team && fpts && gp > 0) {
							const p = utils.createPlayer(name, team);
							const s: IPlayerStats = {
								source: "RotoGrinders",
								recentAveragePoints: Math.round((fpts / gp) * 100) / 100
							};
							p.stats = [s];
							players.push(p);
						}
					});
				}
			}
		}
		return players; 
	}
}
