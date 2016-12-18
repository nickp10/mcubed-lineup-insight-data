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

	validContestTypes = ["fanDuel", "draftKings", "yahoo"];
	validSports = ["mlb", "nba", "nfl", "nhl"];

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
		"GSW": "GS",
		"NOP": "NO",
		"NYK": "NY",
		"PHX": "PHO",
		"UTAH": "UTA",
		"SAS": "SA",
		"WSH": "WAS",

		// NFL
		"GBP": "GB",
		"KCC": "KC",
		"LAR": "LA",
		"NEP": "NE",
		"NOS": "NO",
		"SDC": "SD",
		"SFO": "SF",
		"TBB": "TB"
	};

	/**
	 * Defines a mapping between NFL cities and the corresponding mascot.
	 */
	nflCityToMascot = {
		"Arizona": "Cardinals",
		"Atlanta": "Falcons",
		"Baltimore": "Ravens",
		"Buffalo": "Bills",
		"Carolina": "Panthers",
		"Chicago": "Bears",
		"Cincinnati": "Bengals",
		"Cleveland": "Browns",
		"Dallas": "Cowboys",
		"Denver": "Broncos",
		"Detroit": "Lions",
		"Green Bay": "Packers",
		"Houston": "Texans",
		"Indianapolis": "Colts",
		"Jacksonville": "Jaguars",
		"Kansas City": "Chiefs",
		"Los Angeles": "Rams",
		"Miami": "Dolphins",
		"Minnesota": "Vikings",
		"New England": "Patriots",
		"New Orleans": "Saints",
		//"New York": "Giants",
		//"New York": "Jets",
		"Oakland": "Raiders",
		"Philadelphia": "Eagles",
		"Pittsburgh": "Steelers",
		"San Diego": "Chargers",
		"San Francisco": "49ers",
		"Seattle": "Seahawks",
		"Tampa Bay": "Buccaneers",
		"Tennessee": "Titans",
		"Washington": "Redskins"
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
	 * @param salary The salary of the player.
	 * @returns A player object with the specified name and team.
	 */
	createPlayerCombinedNameTeam(nameTeam: string, salary: number): IPlayer {
		const player = this.createPlayer();
		this.updatePlayerCombinedNameTeam(player, nameTeam, salary);
		return player;
	}

	/**
	 * Updates the player to the specified combined name and team.
	 * 
	 * @param player The player object to update the name and team for.
	 * @param nameTeam The name and team of the player combined (e.g., `Mike Trout (OF, LAA)`).
	 * @param salary The salary of the player.
	 */
	updatePlayerCombinedNameTeam(player: IPlayer, nameTeam: string, salary: number): void {
		if (nameTeam) {
			const nameTeamMatch = nameTeam.trim().match(this.nameTeamRegex);
			if (nameTeamMatch && nameTeamMatch.length >= this.nameTeamRegexNameGroup && nameTeamMatch.length >= this.nameTeamRegexTeamGroup) {
				const name = nameTeamMatch[this.nameTeamRegexNameGroup];
				const team = nameTeamMatch[this.nameTeamRegexTeamGroup];
				this.updatePlayer(player, name, team, salary);
			}
		}
	}

	/**
	 * Creates a player with the specified name and team.
	 * 
	 * @param name The name of the player (in either `First Last` format or `Last, First` format).
	 * @param team The team of the player.
	 * @param salary The salary of the player.
	 * @returns A player object with the specified name and team.
	 */
	createPlayer(name?: string, team?: string, salary?: number): IPlayer {
		const player: IPlayer = {
			name: name,
			team: team,
			salary: salary
		};
		this.updatePlayer(player, name, team, salary);
		return player;
	}

	/**
	 * Updates the player to the specified name and team.
	 * 
	 * @param player The player object to update the name and team for.
	 * @param name The name of the player (in either `First Last` format or `Last, First` format).
	 * @param team The team of the player.
	 * @param salary The salary of the player.
	 */
	updatePlayer(player: IPlayer, name?: string, team?: string, salary?: number): void {
		if (name) {
			// Remove the D/ST from the name for NFL defenses
			name = name.replace("D/ST", "");

			// Remove values like " - Start" and " - Confirmed"
			const hyphenIndex = name.indexOf("- ");
			if (hyphenIndex >= 0) {
				name = name.substr(0, hyphenIndex);
			}
			name = name.trim();

			// If the last name is first, then reverse the names
			const index = name.indexOf(", ");
			if (index >= 0) {
				const last = name.substr(0, index);
				const first = name.substr(index + 2);
				name = `${first} ${last}`;
			}

			// Replace accented characters with the unaccented equivalent
			name = S(name).latinise().s;

			// Normalize NFL team names (for defense projections)
			name = this.normalizeNFLName(name);
			player.name = name;
		}
		if (team) {
			team = team.trim();
			const index = team.indexOf(" ");
			if (index >= 0) {
				team = team.substr(0, index);
			}
			team = team.toUpperCase();
			team = this.alternateTeams[team] || team;
			player.team = team;
		}
		if (salary || salary === 0) {
			player.salary = salary;
		}
	}

	/**
	 * Normalizes the NFL team names such that if only a city is provided, then it is
	 * translated to the city name and mascot. For instance, "Denver" would be normalized
	 * to "Denver Broncos". The only exception is "New York" since it cannot be translated
	 * accurately to either the "Giants" or the "Jets".
	 * 
	 * @param name The name to normalize.
	 * @returns The normalized NFL team name.
	 */
	normalizeNFLName(name: string): string {
		var mascot = this.nflCityToMascot[name];
		if (mascot) {
			return `${name} ${mascot}`;
		}
		return name;
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
