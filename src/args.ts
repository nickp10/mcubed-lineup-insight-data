/// <reference path="../typings/index.d.ts" />

import * as argv from "argv";
import * as utils from "./utils";

class Args {
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

	validate(): void {
		// Validate contest type
		if (!this.contestType) {
			console.error("The -c or --contestType argument must be supplied.");
			process.exit();
		}
		this.contestType = utils.coerceContestType(this.contestType);
		if (!this.contestType) {
			console.error("The -c or --contestType argument must be one of: " + utils.validContestTypes.join(", "));
			process.exit();
		}

		// Validate sport
		if (!this.sport) {
			console.error("The -s or --sport argument must be supplied.");
			process.exit();
		}
		this.sport = utils.coerceSport(this.sport);
		if (!this.sport) {
			console.error("The -s or --sport argument must be one of: " + utils.validSports.join(", "));
			process.exit();
		}
	}
}

const args: Args = new Args();
export = args;
