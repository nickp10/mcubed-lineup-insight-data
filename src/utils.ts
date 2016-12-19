import { IIncomingMessage } from "./interfaces";
import * as http from "http";
import * as https from "https";
import * as Promise from "promise";

class Utils {
	validContestTypes = ["fanDuel", "draftKings", "yahoo"];
	validSports = ["mlb", "nba", "nfl", "nhl"];

	/**
	 * Flattens the specified items such that all items from any sub-arrays recursive
	 * will be returned in a one-dimensional linear array. For example:
	 * 
	 * [
	 *   "A",
	 *   "B",
	 *   [
	 *      "C",
	 *      "D",
	 *      [
	 *         "E",
	 *         "F"
	 *      ]
	 *   ]
	 * ]
	 * 
	 * Would become:
	 * 
	 * [
	 *   "A",
	 *   "B",
	 *   "C",
	 *   "D",
	 *   "E",
	 *   "F"
	 * ]
	 * 
	 * @param arr The array to flatten.
	 * @returns The one-dimensional array containing all the items.
	 */
	flattenArray<T>(arr: T|T[]): T[] {
		const flat: T[] = [];
		if (Array.isArray(arr)) {
			for (let i = 0; i < arr.length; i++) {
				const flatSubArray = this.flattenArray.call(this, arr[i]); 
				flat.push.apply(flat, flatSubArray);
			}
		} else if (arr) {
			flat.push(arr);
		}
		return flat;
	}

	coerceContestType(contestType: string): string {
		let coerceContestType: string = undefined;
		contestType = contestType.toUpperCase();
		this.validContestTypes.forEach((validContestType) => {
			if (validContestType.toUpperCase() === contestType) {
				coerceContestType = validContestType;
			}
		});
		return coerceContestType;
	}

	coerceSport(sport: string): string {
		let coerceSport: string = undefined;
		sport = sport.toUpperCase();
		this.validSports.forEach((validSport) => {
			if (validSport.toUpperCase() === sport) {
				coerceSport = validSport;
			}
		});
		return coerceSport;
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

const utils: Utils = new Utils();
export = utils;
