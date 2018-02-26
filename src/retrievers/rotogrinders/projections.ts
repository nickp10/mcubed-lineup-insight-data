import { IPlayer, IPlayerInsightRetriever, IPlayerStats, ContestType, Sport } from "../../interfaces";
import PlayerFactory from "../../playerFactory";
import utils from "../../utils";

export default class RGProjections implements IPlayerInsightRetriever {
	// Regex for matching the data JSON object in the HTML document
	static dataRegex = /data\s*=\s*(.*?}]);/;
	static dataRegexGroup = 1;

	playerInsight(contestType: ContestType, sport: Sport): PromiseLike<IPlayer[]> {
		const playerFactory = new PlayerFactory(sport);
		switch (contestType) {
			case ContestType.DraftKings:
				switch (sport) {
					case Sport.MLB:
						return this.getData(playerFactory, "draftkings", "mlb-pitcher", "mlb-hitter");
					case Sport.NBA:
						return this.getData(playerFactory, "draftkings", "nba-player");
					case Sport.NFL:
						return this.getData(playerFactory, "draftkings", "nfl-qb", "nfl-flex", "nfl-defense");
					case Sport.NHL:
						return this.getData(playerFactory, "draftkings", "nhl-skater", "nhl-goalie");
				}
				break;
			case ContestType.FanDuel:
				switch (sport) {
					case Sport.MLB:
						return this.getData(playerFactory, "fanduel", "mlb-pitcher", "mlb-hitter");
					case Sport.NBA:
						return this.getData(playerFactory, "fanduel", "nba-player");
					case Sport.NFL:
						return this.getData(playerFactory, "fanduel", "nfl-qb", "nfl-flex", "nfl-defense", "nfl-kicker");
					case Sport.NHL:
						return this.getData(playerFactory, "fanduel", "nhl-skater", "nhl-goalie");
				}
				break;
			case ContestType.Yahoo:
				switch (sport) {
					case Sport.MLB:
						return this.getData(playerFactory, "yahoo", "mlb-pitcher", "mlb-hitter");
					case Sport.NBA:
						return this.getData(playerFactory, "yahoo", "nba-player");
					case Sport.NFL:
						return this.getData(playerFactory, "yahoo", "nfl-qb", "nfl-flex", "nfl-defense");
					case Sport.NHL:
						return this.getData(playerFactory, "yahoo", "nhl-skater", "nhl-goalie");
				}
				break;
		}
		return Promise.reject<IPlayer[]>("An unknown contest type or sport was specified");
	}

	getData(playerFactory: PlayerFactory, contest: string, ...pages: string[]): PromiseLike<IPlayer[]> {
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
						const salary = utils.coerceInt(playerJson.salary);
						if (name && team) {
							let projectedPoints = utils.coerceFloat(playerJson["projected points"]);
							if (!projectedPoints) {
								projectedPoints = utils.coerceFloat(playerJson["points"]);
							}
							const p = playerFactory.createPlayer(name, team, salary);
							const s: IPlayerStats = {
								source: "RotoGrinders",
								projectedCeiling: utils.coerceFloat(playerJson.ceil),
								projectedFloor: utils.coerceFloat(playerJson.floor),
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
