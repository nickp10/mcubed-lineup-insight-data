/// <reference path="../../typings/index.d.ts" />

import { IDataRetriever, ISiteDataRetriever, IPlayer, IPlayerStats } from "../interfaces";
import * as cheerio from "cheerio";
import * as http from "http";
import * as https from "https";
import * as Promise from "promise";
import * as setCookieParser from "set-cookie-parser";
import * as utils from "../utils";

interface IIncomingMessage extends http.IncomingMessage {
	body?: string;
}

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
		"nhl/daily-fantasy/daily-hockey-projections/skaters",
		"nhl/daily-fantasy/daily-hockey-projections/goalies"
	];

	fanDuel = {
		mlb: () => this.getData(NumberFire.mlbSetSiteURL, NumberFire.fanDuelID, NumberFire.mlbDataSiteURLs),
		nba: () => this.getData(NumberFire.nbaSetSiteURL, NumberFire.fanDuelID, NumberFire.nbaDataSiteURLs),
		nfl: () => this.getData(NumberFire.nflSetSiteURL, NumberFire.fanDuelID, NumberFire.nflDataSiteURLs),
		nhl: () => this.getData(NumberFire.nhlSetSiteURL, NumberFire.fanDuelID, NumberFire.nhlDataSiteURLs)
	};

	draftKings = {
		mlb: () => this.getData(NumberFire.mlbSetSiteURL, NumberFire.draftKingsID, NumberFire.mlbDataSiteURLs),
		nba: () => this.getData(NumberFire.nbaSetSiteURL, NumberFire.draftKingsID, NumberFire.nbaDataSiteURLs),
		nfl: () => this.getData(NumberFire.nflSetSiteURL, NumberFire.draftKingsID, NumberFire.nflDataSiteURLs),
		nhl: () => this.getData(NumberFire.nhlSetSiteURL, NumberFire.draftKingsID, NumberFire.nhlDataSiteURLs)
	};

	yahoo = {
		mlb: () => this.getData(NumberFire.mlbSetSiteURL, NumberFire.yahooID, NumberFire.mlbDataSiteURLs),
		nba: () => this.getData(NumberFire.nbaSetSiteURL, NumberFire.yahooID, NumberFire.nbaDataSiteURLs),
		nfl: () => this.getData(NumberFire.nflSetSiteURL, NumberFire.yahooID, NumberFire.nflDataSiteURLs),
		nhl: () => this.getData(NumberFire.nhlSetSiteURL, NumberFire.yahooID, NumberFire.nhlDataSiteURLs)
	};

	getData(setSiteURL: string, siteID: string, dataSiteURLs: string[]): Promise.IThenable<IPlayer[]> {
		return this.sendHttpsRequest({
			hostname: "www.numberfire.com",
			path: setSiteURL,
			method: "POST"
		}, `site=${siteID}`).then((setSiteResp) => {
			const setCookies = setCookieParser(setSiteResp);
			const cookieHeaders = setCookies.map(c => `${c.name}=${c.value}`);
			const dataPromises = dataSiteURLs.map(dataSiteURL => this.getDataForURL(dataSiteURL, cookieHeaders));
			return Promise.all(dataPromises).then((playersArrays) => {
				return utils.flattenArray<IPlayer>(playersArrays);
			});
		});
	}

	getDataForURL(dataSiteURL: string, cookieHeaders: string[]): Promise.IThenable<IPlayer[]> {
		return this.sendHttpsRequest({
			hostname: "www.numberfire.com",
			path: dataSiteURL,
			method: "GET",
			headers: {
				Cookie: cookieHeaders
			}
		}).then((dataResp) => {
			return this.parsePlayers(cheerio.load(dataResp.body));
		});
	}

	parsePlayers($: CheerioStatic): IPlayer[] {
		const players: {[key:string]: IPlayer} = { };
		$(".projection-table__body tr").each((index, item) => {
			const playerId = $(item).data("player-id");
			let player = players[playerId];
			if (!player) {
				player = utils.createPlayer();
				players[playerId] = player;
			}
			const playerNameTeam = $(item).find(".full a").text();
			utils.updatePlayerCombinedNameTeam(player, playerNameTeam);
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

	sendHttpsRequest(request: https.RequestOptions, data?: string): Promise.IThenable<IIncomingMessage> {
		return new Promise<IIncomingMessage>((resolve, reject) => {
			const headers = request.headers || { };
			request.headers = headers;
			if (data) {
				headers["Content-Type"] = "application/x-www-form-urlencoded";
				headers["Content-Length"] = data.length;
			}
			const req = https.request(request, (resp: IIncomingMessage) => {
				let body = "";
				resp.on("data", (data) => {
					body += data;
				});
				resp.on("end", () => {
					resp.body = body;
					resolve(resp);
				});
			}).on("error", (error: Error) => {
				reject(error.message);
			});
			if (data) {
				req.write(data);
			}
			req.end();
		});
	}
}
