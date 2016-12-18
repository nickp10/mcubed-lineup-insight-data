/// <reference path="../../../typings/index.d.ts" />

import { IDataRetriever, ISiteDataRetriever, IPlayer, IPlayerStats } from "../../interfaces";
import * as Promise from "promise";
import * as utils from "../../utils";

export default class RGProjections implements IDataRetriever {
	// Regex for matching the data JSON object in the HTML document
	static dataRegex = /data\s*=\s*(.*?}]);/;
	static dataRegexGroup = 1;

	draftKings = {
		mlb: () => this.getData("draftkings", "mlb-pitcher", "mlb-hitter"),
		nba: () => this.getData("draftkings", "nba-player"),
		nfl: () => this.getData("draftkings", "nfl-qb", "nfl-flex", "nfl-defense"),
		nhl: () => this.getData("draftkings", "nhl-skater", "nhl-goalie")
	};

	fanDuel = {
		mlb: () => this.getData("fanduel", "mlb-pitcher", "mlb-hitter"),
		nba: () => this.getData("fanduel", "nba-player"),
		nfl: () => this.getData("fanduel", "nfl-qb", "nfl-flex", "nfl-defense", "nfl-kicker"),
		nhl: () => this.getData("fanduel", "nhl-skater", "nhl-goalie")
	};

	yahoo = {
		mlb: () => this.getData("yahoo", "mlb-pitcher", "mlb-hitter"),
		nba: () => this.getData("yahoo", "nba-player"),
		nfl: () => this.getData("yahoo", "nfl-qb", "nfl-flex", "nfl-defense"),
		nhl: () => this.getData("yahoo", "nhl-skater", "nhl-goalie")
	};

	getData(contest: string, ...pages: string[]): Promise.IThenable<IPlayer[]> {
		const promises = pages.map((page) => {
			return utils.sendHttpsRequest({
				hostname: "rotogrinders.com",
				path: `/projected-stats/${page}?site=${contest}`,
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
			const dataMatch = data.match(RGProjections.dataRegex);
			if (dataMatch && dataMatch.length >= RGProjections.dataRegexGroup) {
				const json = dataMatch[RGProjections.dataRegexGroup];
				const playersJson = JSON.parse(json);
				if (Array.isArray(playersJson)) {
					playersJson.forEach((playerJson) => {
						const playerElement = playerJson.player;
						let name: string = undefined;
						if (typeof playerElement === "object") {
							name = `${playerElement.first_name} ${playerElement.last_name}`;
						} else if (typeof playerElement === "string") {
							name = playerElement;
						}
						const team = playerJson.team;
						const salary = parseInt(playerJson.salary);
						if (name && team) {
							let projectedPoints = parseFloat(playerJson["projected points"]);
							if (!projectedPoints) {
								projectedPoints = parseFloat(playerJson["points"]);
							}
							const p = utils.createPlayer(name, team, salary);
							const s: IPlayerStats = {
								source: "RotoGrinders",
								projectedCeiling: parseFloat(playerJson.ceil),
								projectedFloor: parseFloat(playerJson.floor),
								projectedPoints: projectedPoints
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
