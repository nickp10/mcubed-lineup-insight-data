/// <reference path="../../../typings/index.d.ts" />

import { IDataRetriever, ISiteDataRetriever, IPlayer, IPlayerStats } from "../../interfaces";
import PlayerFactory from "../../playerFactory";
import * as Promise from "promise";
import * as utils from "../../utils";

export default class RGProjections implements IDataRetriever {
	// Regex for matching the data JSON object in the HTML document
	static dataRegex = /data\s*=\s*(.*?}]);/;
	static dataRegexGroup = 1;

	draftKings = {
		mlb: (playerFactory: PlayerFactory) => this.getData(playerFactory, "draftkings", "mlb-pitcher", "mlb-hitter"),
		nba: (playerFactory: PlayerFactory) => this.getData(playerFactory, "draftkings", "nba-player"),
		nfl: (playerFactory: PlayerFactory) => this.getData(playerFactory, "draftkings", "nfl-qb", "nfl-flex", "nfl-defense"),
		nhl: (playerFactory: PlayerFactory) => this.getData(playerFactory, "draftkings", "nhl-skater", "nhl-goalie")
	};

	fanDuel = {
		mlb: (playerFactory: PlayerFactory) => this.getData(playerFactory, "fanduel", "mlb-pitcher", "mlb-hitter"),
		nba: (playerFactory: PlayerFactory) => this.getData(playerFactory, "fanduel", "nba-player"),
		nfl: (playerFactory: PlayerFactory) => this.getData(playerFactory, "fanduel", "nfl-qb", "nfl-flex", "nfl-defense", "nfl-kicker"),
		nhl: (playerFactory: PlayerFactory) => this.getData(playerFactory, "fanduel", "nhl-skater", "nhl-goalie")
	};

	yahoo = {
		mlb: (playerFactory: PlayerFactory) => this.getData(playerFactory, "yahoo", "mlb-pitcher", "mlb-hitter"),
		nba: (playerFactory: PlayerFactory) => this.getData(playerFactory, "yahoo", "nba-player"),
		nfl: (playerFactory: PlayerFactory) => this.getData(playerFactory, "yahoo", "nfl-qb", "nfl-flex", "nfl-defense"),
		nhl: (playerFactory: PlayerFactory) => this.getData(playerFactory, "yahoo", "nhl-skater", "nhl-goalie")
	};

	getData(playerFactory: PlayerFactory, contest: string, ...pages: string[]): Promise.IThenable<IPlayer[]> {
		const promises = pages.map((page) => {
			return utils.sendHttpsRequest({
				hostname: "rotogrinders.com",
				path: `/projected-stats/${page}?site=${contest}`,
				method: "GET"
			}).then((dataResp) => {
				return this.parsePlayers(playerFactory, dataResp.body);
			});
		});
		return Promise.all(promises).then((playersArrays) => {
			return utils.flattenArray<IPlayer>(playersArrays);
		});
	}

	parsePlayers(playerFactory: PlayerFactory, data: string): IPlayer[] {
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
							const p = playerFactory.createPlayer(name, team, salary);
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
