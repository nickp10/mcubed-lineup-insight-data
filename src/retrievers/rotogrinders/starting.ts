/// <reference path="../../../typings/index.d.ts" />

import { IDataRetriever, ISiteDataRetriever, IPlayer, IPlayerStats } from "../../interfaces";
import * as cheerio from "cheerio";
import * as Promise from "promise";
import * as utils from "../../utils";

export default class RGStarting implements IDataRetriever {
	draftKings = {
		mlb: () => this.getData("draftkings", "mlb"),
		nba: () => this.getData("draftkings", "nba"),
		nfl: () => this.getData("draftkings", "nfl"),
		nhl: () => this.getData("draftkings", "nhl")
	};

	fanDuel = {
		mlb: () => this.getData("fanduel", "mlb"),
		nba: () => this.getData("fanduel", "nba"),
		nfl: () => this.getData("fanduel", "nfl"),
		nhl: () => this.getData("fanduel", "nhl")
	};

	yahoo = {
		mlb: () => this.getData("yahoo", "mlb"),
		nba: () => this.getData("yahoo", "nba"),
		nfl: () => this.getData("yahoo", "nfl"),
		nhl: () => this.getData("yahoo", "nhl")
	};

	getData(contest: string, sport: string): Promise.IThenable<IPlayer[]> {
		return utils.sendHttpsRequest({
			hostname: "rotogrinders.com",
			path: `/lineups/${sport}?site=${contest}`,
			method: "GET"
		}).then((dataResp) => {
			return this.parsePlayers(cheerio.load(dataResp.body), sport);
		});
	}

	parsePlayers($: CheerioStatic, sport: string): IPlayer[] {
		const players: IPlayer[] = [];
		$("li[data-role=lineup-card]").each((index, element) => {
			const game = $(element);
			const away = game.attr("data-away");
			const home = game.attr("data-home");
			this.parsePlayersForLineup(players, $("div[class*=away-team]", game).first(), away, sport);
			this.parsePlayersForLineup(players, $("div[class*=home-team]", game).first(), home, sport);
		});
		return players;
	}

	parsePlayersForLineup(players: IPlayer[], lineup: Cheerio, team: string, sport: string): void {
		if (team) {
			if (sport === "nhl" || sport === "mlb") {
				const pitcher = cheerio("div[class*=pitcher] a", lineup).first();
				if (pitcher) {
					const player = this.createPlayer(pitcher, pitcher, sport, team);
					if (player) {
						players.push(player);
					}
				}
			}
			cheerio("ul[class*=players]", lineup).each((index, element) => {
				let hasSeenPlayer = false;
				const playerItems = cheerio("li", element);
				for (let i = 0; i < playerItems.length; i++) {
					const playerItem = cheerio(playerItems.get(i));
					if (sport === "nba") {
						if (playerItem.html() === "Bench") {
							break;
						}
					}
					if (playerItem.attr("class") === "player") {
						if (sport === "nfl") {
							if (hasSeenPlayer && i + 1 === playerItems.length) {
								break;
							}
						}
						const salary = playerItem.attr("data-salary");
						if (salary) {
							const playerName = cheerio("span[class=pname] a", playerItem).first();
							const player = this.createPlayer(playerItem, playerName, sport, team);
							if (player) {
								hasSeenPlayer = true;
								players.push(player);
							}
						}
					}
				}
			});
		}
		return undefined;
	}

	createPlayer(playerItem: Cheerio, playerName: Cheerio, sport: string, team: string): IPlayer {
		let name = playerName.attr("title");
		if (!name) {
			name = playerName.html();
		}
		if (name) {
			const player = utils.createPlayer(name, team);
			if (sport === "mlb") {
				const startingOrder = cheerio("span[class=order]", playerItem).html();
				player.battingOrder = this.parseBattingOrder(startingOrder);
			}
			player.isStarter = true;
			return player;
		}
		return undefined;
	}

	parseBattingOrder(startingOrder: string): string {
		try {
			const order = parseInt(startingOrder);
			if (order === 1) {
				return "1st";
			} else if (order === 2) {
				return "2nd";
			} else if (order === 3) {
				return "3rd";
			} else if (order >= 4 && order <= 9) {
				return `${order}th`;
			}
		} catch(Error) {
		}
		return "NA";
	}
}
