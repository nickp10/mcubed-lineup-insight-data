import { IDataRetriever, ISiteDataRetriever, IPlayer, IPlayerStats } from "../../interfaces";
import PlayerFactory from "../../playerFactory";
import * as utils from "../../utils";

export default class RGRecent implements IDataRetriever {
	// Regex for matching the data JSON object in the HTML document
	static dataRegex = /data\s*=\s*(.*?}]);/;
	static dataRegexGroup = 1;

	draftKings = {
		mlb: (playerFactory: PlayerFactory) => this.getData(playerFactory, "mlb-pitcher?site=draftkings&range=4weeks", "mlb-hitter?site=draftkings&range=1week"),
		nba: (playerFactory: PlayerFactory) => this.getData(playerFactory, "nba-player?site=draftkings&range=1week"),
		nfl: (playerFactory: PlayerFactory) => this.getData(playerFactory, "nfl-offense?site=draftkings&range=4weeks", "nfl-defense?site=draftkings&range=4weeks", "nfl-kicker?site=draftkings&range=4weeks"),
		nhl: (playerFactory: PlayerFactory) => this.getData(playerFactory, "nhl-skater?site=draftkings&range=1week", "nhl-goalie?site=draftkings&range=1week")
	};

	fanDuel = {
		mlb: (playerFactory: PlayerFactory) => this.getData(playerFactory, "mlb-pitcher?site=fanduel&range=4weeks", "mlb-hitter?site=fanduel&range=1week"),
		nba: (playerFactory: PlayerFactory) => this.getData(playerFactory, "nba-player?site=fanduel&range=1week"),
		nfl: (playerFactory: PlayerFactory) => this.getData(playerFactory, "nfl-offense?site=fanduel&range=4weeks", "nfl-defense?site=fanduel&range=4weeks", "nfl-kicker?site=fanduel&range=4weeks"),
		nhl: (playerFactory: PlayerFactory) => this.getData(playerFactory, "nhl-skater?site=fanduel&range=1week", "nhl-goalie?site=fanduel&range=1week")
	};

	yahoo = {
		mlb: (playerFactory: PlayerFactory) => this.getData(playerFactory, "mlb-pitcher?site=yahoo&range=4weeks", "mlb-hitter?site=yahoo&range=1week"),
		nba: (playerFactory: PlayerFactory) => this.getData(playerFactory, "nba-player?site=yahoo&range=1week"),
		nfl: (playerFactory: PlayerFactory) => this.getData(playerFactory, "nfl-offense?site=yahoo&range=4weeks", "nfl-defense?site=yahoo&range=4weeks", "nfl-kicker?site=yahoo&range=4weeks"),
		nhl: (playerFactory: PlayerFactory) => this.getData(playerFactory, "nhl-skater?site=yahoo&range=1week", "nhl-goalie?site=yahoo&range=1week")
	};

	getData(playerFactory: PlayerFactory, ...pages: string[]): PromiseLike<IPlayer[]> {
		const promises = pages.map((page) => {
			return utils.sendHttpsRequest({
				hostname: "rotogrinders.com",
				path: `/game-stats/${page}`,
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
			const dataMatch = data.match(RGRecent.dataRegex);
			if (dataMatch && dataMatch.length >= RGRecent.dataRegexGroup) {
				const json = dataMatch[RGRecent.dataRegexGroup];
				const playersJson = JSON.parse(json);
				if (Array.isArray(playersJson)) {
					playersJson.forEach((playerJson) => {
						const name = playerJson.player;
						const team = playerJson.team;
						const salary = utils.coerceInt(playerJson.salary);
						const fpts = utils.coerceFloat(playerJson.fpts);
						const gp = utils.coerceInt(playerJson.gp);
						if (name && team && fpts && gp > 0) {
							const p = playerFactory.createPlayer(name, team, salary);
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
