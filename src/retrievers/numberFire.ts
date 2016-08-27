/// <reference path="../../typings/index.d.ts" />

import { IDataRetriever, ISiteDataRetriever, IPlayer } from "../interfaces";
import * as http from "http";
import * as https from "https";
import * as Promise from "promise";
import * as setCookieParser from "set-cookie-parser";

interface IIncomingMessage extends http.IncomingMessage {
	body?: string;
}

export default class NumberFire implements IDataRetriever {
	static mlbSetSiteURL = "/mlb/daily-fantasy/set-dfs-site";
	static nbaSetSiteURL = "/nba/daily-fantasy/set-dfs-site";
	static nflSetSiteURL = "/nfl/daily-fantasy/set-dfs-site";
	static nhlSetSiteURL = "/nhl/daily-fantasy/set-dfs-site";

	static mlbDataSiteURLs = [
		"/mlb/daily-fantasy/daily-baseball-projections/pitchers",
		"/mlb/daily-fantasy/daily-baseball-projections/batters"
	];
	static nbaDataSiteURLs = [
		"",
		""
	];
	static nflDataSiteURLs = [
		"",
		""
	];
	static nhlDataSiteURLs = [
		"",
		""
	];

	static fanDuelID = "3";
	static draftKingsID = "4";
	static yahooID = "13";

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
			const cookieHeader = setCookies.map(c => `${c.name}=${c.value}`);
			return this.sendHttpsRequest({
				hostname: "www.numberfire.com",
				path: dataSiteURLs[0],
				method: "GET",
				headers: {
					Cookie: cookieHeader
				}
			}).then((dataResp) => {
				return undefined;
			});
		});
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
