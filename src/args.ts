/// <reference path="../typings/index.d.ts" />

import * as argv from "argv";

class Args {
	static validContestTypes = ["fanDuel", "draftKings", "yahoo"];
	static validSports = ["mlb", "nba", "nfl", "nhl"];
	contestType: string;
	sport: string;

	constructor() {
		const args = argv
			.option({ name: "contestType", short: "c", type: "string" })
			.option({ name: "sport", short: "s", type: "string" })
			.run();
		this.contestType = args.options["contestType"];
		this.sport = args.options["sport"];
		this.validate();
	}

	coerceContestType(contestType: string): string {
		let coerceContestType: string = undefined;
		Args.validContestTypes.forEach((validContestType) => {
			if (validContestType.toUpperCase() === contestType) {
				coerceContestType = validContestType;
			}
		});
		return coerceContestType;
	}

	coerceSport(sport: string): string {
		let coerceSport: string = undefined;
		Args.validSports.forEach((validSport) => {
			if (validSport.toUpperCase() === sport) {
				coerceSport = validSport;
			}
		});
		return coerceSport;
	}

	validate(): void {
		// Validate contest type
		if (!this.contestType) {
			console.error("The -c or --contestType argument must be supplied.");
			process.exit();
		}
		this.contestType = this.coerceContestType(this.contestType.toUpperCase());
		if (!this.contestType) {
			console.error("The -c or --contestType argument must be one of: " + Args.validContestTypes.join(", "));
			process.exit();
		}

		// Validate sport
		if (!this.sport) {
			console.error("The -s or --sport argument must be supplied.");
			process.exit();
		}
		this.sport = this.coerceSport(this.sport.toUpperCase());
		if (!this.sport) {
			console.error("The -s or --sport argument must be one of: " + Args.validSports.join(", "));
			process.exit();
		}
	}
}

const args: Args = new Args();
export = args;
