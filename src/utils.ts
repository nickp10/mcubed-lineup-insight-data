import { IIncomingMessage, IPlayer } from "./interfaces";
import * as http from "http";
import * as https from "https";
import * as S from "string";

class Utils {
	/**
	 * Defines the regex for parsing the name and team from a string like: Mike Trout (OF, LAA).
	 */
	nameTeamRegex = /(.*?)\s\((.*?,\s)?(.*?)\)/;
	nameTeamRegexNameGroup = 1;
	nameTeamRegexTeamGroup = 3;

	/**
	 * Defines a mapping of alternate teams.
	 * The key represents the team name from external sites.
	 * The value represents the corresponding team name from the contest site.
	 */
	alternateTeams = {
		// MLB
		"CHW": "CWS",
		"KCR": "KAN",
		"SF": "SFG",
		"TBR": "TAM",

		// NBA
		"NOP": "NO",
		"SAS": "SA",
		"GSW": "GS"
	};

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

	/**
	 * Creates a player with the specified combined name and team.
	 * 
	 * @param nameTeam The name and team of the player combined (e.g., `Mike Trout (OF, LAA)`).
	 * @returns A player object with the specified name and team.
	 */
	createPlayerCombinedNameTeam(nameTeam: string): IPlayer {
		const player = this.createPlayer();
		this.updatePlayerCombinedNameTeam(player, nameTeam);
		return player;
	}

	/**
	 * Updates the player to the specified combined name and team.
	 * 
	 * @param player The player object to update the name and team for.
	 * @param nameTeam The name and team of the player combined (e.g., `Mike Trout (OF, LAA)`).
	 */
	updatePlayerCombinedNameTeam(player: IPlayer, nameTeam: string): void {
		if (nameTeam) {
			const nameTeamMatch = nameTeam.trim().match(this.nameTeamRegex);
			if (nameTeamMatch && nameTeamMatch.length >= this.nameTeamRegexNameGroup && nameTeamMatch.length >= this.nameTeamRegexTeamGroup) {
				const name = nameTeamMatch[this.nameTeamRegexNameGroup];
				const team = nameTeamMatch[this.nameTeamRegexTeamGroup];
				this.updatePlayer(player, name, team);
			}
		}
	}

	/**
	 * Creates a player with the specified name and team.
	 * 
	 * @param name The name of the player (in either `First Last` format or `Last, First` format).
	 * @param team The team of the player.
	 * @returns A player object with the specified name and team.
	 */
	createPlayer(name?: string, team?: string): IPlayer {
		const player: IPlayer = {
			name: name,
			team: team
		};
		this.updatePlayer(player, name, team);
		return player;
	}

	/**
	 * Updates the player to the specified  name and team.
	 * 
	 * @param player The player object to update the name and team for.
	 * @param name The name of the player (in either `First Last` format or `Last, First` format).
	 * @param team The team of the player.
	 */
	updatePlayer(player: IPlayer, name?: string, team?: string): void {
		if (name) {
			const index = name.indexOf(", ");
			if (index >= 0) {
				const first = name.substr(0, index);
				const last = name.substr(index + 2);
				name = `${first} ${last}`;
			}
			name = S(name).latinise().s;
			player.name = name;
		}
		if (team) {
			const index = team.indexOf(" ");
			if (index >= 0) {
				team = team.substr(0, index);
			}
			team = team.toUpperCase();
			team = this.alternateTeams[team] || team;
			player.team = team;
		}
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
