import { IDataRetriever, IIncomingMessage, ISiteDataRetriever, IPlayer, IPlayerStats } from "../interfaces";
import * as cheerio from "cheerio";
import PlayerFactory from "../playerFactory";
import * as setCookieParser from "set-cookie-parser";
import * as utils from "../utils";

export default class NumberFire implements IDataRetriever {
	// IDs for setting the DFS site to retrieve projection stats for
	static fanDuelID = "3";
	static draftKingsID = "4";
	static yahooID = "13";

	// URL to post the DFS site ID to for each sport
	static mlbSetSiteURL = "/mlb/daily-fantasy/set-dfs-site";
	static nbaSetSiteURL = "/nba/daily-fantasy/set-dfs-site";
	static nflSetSiteURL = "/nfl/daily-fantasy/set-dfs-site";
	static nhlSetSiteURL = "/nhl/daily-fantasy/set-dfs-site";

	// URLs for retrieving projections for each sport
	static mlbDataSiteURLs = [
		"/mlb/daily-fantasy/daily-baseball-projections/pitchers",
		"/mlb/daily-fantasy/daily-baseball-projections/batters"
	];
	static nbaDataSiteURLs = [
		"/nba/daily-fantasy/daily-basketball-projections"
	];
	static nflDataSiteURLs = [
		"/nfl/daily-fantasy/daily-football-projections",
		"/nfl/daily-fantasy/daily-football-projections/K",
		"/nfl/daily-fantasy/daily-football-projections/D"
	];
	static nhlDataSiteURLs = [
		"/nhl/daily-fantasy/daily-hockey-projections/skaters",
		"/nhl/daily-fantasy/daily-hockey-projections/goalies"
	];

	fanDuel = {
		mlb: (playerFactory: PlayerFactory) => this.getData(playerFactory, NumberFire.mlbSetSiteURL, NumberFire.fanDuelID, NumberFire.mlbDataSiteURLs),
		nba: (playerFactory: PlayerFactory) => this.getData(playerFactory, NumberFire.nbaSetSiteURL, NumberFire.fanDuelID, NumberFire.nbaDataSiteURLs),
		nfl: (playerFactory: PlayerFactory) => this.getData(playerFactory, NumberFire.nflSetSiteURL, NumberFire.fanDuelID, NumberFire.nflDataSiteURLs),
		nhl: (playerFactory: PlayerFactory) => this.getData(playerFactory, NumberFire.nhlSetSiteURL, NumberFire.fanDuelID, NumberFire.nhlDataSiteURLs)
	};

	draftKings = {
		mlb: (playerFactory: PlayerFactory) => this.getData(playerFactory, NumberFire.mlbSetSiteURL, NumberFire.draftKingsID, NumberFire.mlbDataSiteURLs),
		nba: (playerFactory: PlayerFactory) => this.getData(playerFactory, NumberFire.nbaSetSiteURL, NumberFire.draftKingsID, NumberFire.nbaDataSiteURLs),
		nfl: (playerFactory: PlayerFactory) => this.getData(playerFactory, NumberFire.nflSetSiteURL, NumberFire.draftKingsID, NumberFire.nflDataSiteURLs),
		nhl: (playerFactory: PlayerFactory) => this.getData(playerFactory, NumberFire.nhlSetSiteURL, NumberFire.draftKingsID, NumberFire.nhlDataSiteURLs)
	};

	yahoo = {
		mlb: (playerFactory: PlayerFactory) => this.getData(playerFactory, NumberFire.mlbSetSiteURL, NumberFire.yahooID, NumberFire.mlbDataSiteURLs),
		nba: (playerFactory: PlayerFactory) => this.getData(playerFactory, NumberFire.nbaSetSiteURL, NumberFire.yahooID, NumberFire.nbaDataSiteURLs),
		nfl: (playerFactory: PlayerFactory) => this.getData(playerFactory, NumberFire.nflSetSiteURL, NumberFire.yahooID, NumberFire.nflDataSiteURLs),
		nhl: (playerFactory: PlayerFactory) => this.getData(playerFactory, NumberFire.nhlSetSiteURL, NumberFire.yahooID, NumberFire.nhlDataSiteURLs)
	};

	getData(playerFactory: PlayerFactory, setSiteURL: string, siteID: string, dataSiteURLs: string[]): PromiseLike<IPlayer[]> {
		return utils.sendHttpsRequest({
			hostname: "www.numberfire.com",
			path: setSiteURL,
			method: "POST"
		}, `site=${siteID}`).then((setSiteResp) => {
			return this.parseData(playerFactory, dataSiteURLs, setSiteResp);
		});
	}

	getDataForURL(playerFactory: PlayerFactory, dataSiteURL: string, cookieHeaders: string[]): PromiseLike<IPlayer[]> {
		return utils.sendHttpsRequest({
			hostname: "www.numberfire.com",
			path: dataSiteURL,
			method: "GET",
			headers: {
				Cookie: cookieHeaders
			}
		}).then((dataResp) => {
			return this.parsePlayers(playerFactory, cheerio.load(dataResp.body));
		});
	}

	parseData(playerFactory: PlayerFactory, dataSiteURLs: string[], setSiteResp: IIncomingMessage): PromiseLike<IPlayer[]> {
		const setCookies = setCookieParser(setSiteResp);
		const cookieHeaders = setCookies.map(c => `${c.name}=${c.value}`);
		const dataPromises = dataSiteURLs.map(dataSiteURL => this.getDataForURL(playerFactory, dataSiteURL, cookieHeaders));
		return Promise.all(dataPromises).then((playersArrays) => {
			return utils.flattenArray<IPlayer>(playersArrays);
		});
	}

	parsePlayers(playerFactory: PlayerFactory, $: CheerioStatic): IPlayer[] {
		const players: {[key:string]: IPlayer} = { };
		$(".stat-table__body tr").each((index, item) => {
			const playerId = $(item).data("player-id");
			let player = players[playerId];
			if (!player) {
				player = playerFactory.createPlayer();
				players[playerId] = player;
			}
			const playerName = $("a.full", item).text();
			const playerTeam = $(".team-player__team.active", item).text();
			const playerSalary = this.parseSalary($(item).find(".cost").text());
			playerFactory.updatePlayer(player, playerName, playerTeam, playerSalary);
			const points = $(item).find(".fp").text();
			if (points) {
				const stats: IPlayerStats = {
					source: "NumberFire",
					projectedPoints: parseFloat(points.trim())
				};
				let playerStats = player.stats;
				if (!playerStats) {
					playerStats = [];
					player.stats = playerStats;
				}
				playerStats.push(stats);
			}
		});
		const playersArray: IPlayer[] = [];
		for (const key in players) {
			const player = players[key];
			if (player.name && player.team) {
				playersArray.push(player);
			}
		}
		return playersArray;
	}

	parseSalary(salary: string): number {
		if (salary) {
			salary = salary.trim().replace("$", "").replace(",", "");
			if (salary !== "N/A") {
				return parseInt(salary);
			}
		}
		return 0;
	}
}
