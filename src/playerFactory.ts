import { IPlayer, Sport } from "./interfaces";
import * as S from "string";

export default class PlayerFactory {
	/**
	 * Defines the regex for parsing the name and team from a string like: Mike Trout (OF, LAA).
	 */
	private static nameTeamRegex = /(.*?)\s\((.*?,\s)?(.*?)\)/;
	private static nameTeamRegexNameGroup = 1;
	private static nameTeamRegexTeamGroup = 3;

	/**
	 * Defines a mapping of alternate teams.
	 * The key represents the team name from external sites.
	 * The value represents the corresponding team name from the contest site.
	 */
	private static alternateTeamsBySport = new Map([
		[Sport.MLB, new Map([
			["CHW", "CWS"],
			["KC", "KAN"],
			["KCR", "KAN"],
			["LAD", "LOS"],
			["SD", "SDP"],
			["SF", "SFG"],
			["TBR", "TAM"],
			["WSH", "WAS"]
		])],
		[Sport.NBA, new Map([
			["GSW", "GS"],
			["NOP", "NO"],
			["NYK", "NY"],
			["PHX", "PHO"],
			["UTAH", "UTA"],
			["SAS", "SA"],
			["WSH", "WAS"]
		])],
		[Sport.NFL, new Map([
			["GBP", "GB"],
			["KCC", "KC"],
			["LA", "LAR"],
			["NEP", "NE"],
			["NOS", "NO"],
			["SDC", "SD"],
			["SFO", "SF"],
			["TBB", "TB"]
		])],
		[Sport.NHL, new Map([
			["MTL", "MON"]
		])]
	]);

	/**
	 * Defines a mapping between NFL cities and the corresponding mascot.
	 */
	private static nflCityToMascot = {
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

	private alternateTeams: Map<string, string>;

	constructor(sport: Sport) {
		this.alternateTeams = PlayerFactory.alternateTeamsBySport.get(sport);
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
			const nameTeamMatch = nameTeam.trim().match(PlayerFactory.nameTeamRegex);
			if (nameTeamMatch && nameTeamMatch.length >= PlayerFactory.nameTeamRegexNameGroup && nameTeamMatch.length >= PlayerFactory.nameTeamRegexTeamGroup) {
				const name = nameTeamMatch[PlayerFactory.nameTeamRegexNameGroup];
				const team = nameTeamMatch[PlayerFactory.nameTeamRegexTeamGroup];
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
			team = this.alternateTeams.get(team) || team;
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
		var mascot = PlayerFactory.nflCityToMascot[name];
		if (mascot) {
			return `${name} ${mascot}`;
		}
		return name;
	}
}
