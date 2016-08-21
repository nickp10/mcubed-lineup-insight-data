/// <reference path="../../typings/index.d.ts" />

import { IDataRetriever, ISiteDataRetriever, IPlayer } from "../interfaces";
import * as cookie from "cookie";
import * as http from "http";
import * as https from "https";
import * as Promise from "promise";

interface IIncomingMessage extends http.IncomingMessage {
	body?: string;
}

export default class NumberFire implements IDataRetriever {
	fanDuel = {
		mlb: this.getData.bind(this),
		nba: this.getData.bind(this),
		nfl: this.getData.bind(this),
		nhl: this.getData.bind(this)
	};

	getData(): Promise.IThenable<IPlayer[]> {
		return this.sendHttpsRequest({
			hostname: "www.numberfire.com",
			path: "/mlb/daily-fantasy/daily-baseball-projections/pitchers",
			method: "GET"
		}).then((resp) => {
			resp.rawHeaders.forEach(element => {
				console.log(element);
			});
			/*resp.headers["set-cookie"].forEach((cookieHeader) => {
				var c = cookie.parse(cookieHeader);
				var d: CookieParseOptions;
			});
			console.log(resp.body);*/
			return undefined;
		});
	}

	sendHttpsRequest(request: https.RequestOptions): Promise.IThenable<IIncomingMessage> {
		return new Promise<IIncomingMessage>((resolve, reject) => {
			https.request(request, (resp: IIncomingMessage) => {
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
			}).end();
		});
	}
}
