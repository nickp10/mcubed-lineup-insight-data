import { ContestType, DataType, Sport } from "./interfaces";
import * as argv from "argv";
import * as utils from "./utils";

class Args {
	dataType: DataType;
	contestType: ContestType;
	sport: Sport;

	constructor() {
		const args = argv
			.option({ name: "data", short: "d", type: "string" })
			.option({ name: "contestType", short: "c", type: "string" })
			.option({ name: "sport", short: "s", type: "string" })
			.run();
		const argData = args.options["data"];
		const argContestType = args.options["contestType"];
		const argSport = args.options["sport"];
		this.validate(argData, argContestType, argSport);
	}

	validate(argDataType: string, argContestType: string, argSport: string): void {
		// Validate data
		this.dataType = utils.coerceDataType(argDataType) || DataType.PlayerInsight;
		if (!this.dataType) {
			console.error("The -d or --data argument must be one of: " + utils.validDataTypes().join(", "));
			process.exit();
		}

		// Validate contest type
		if (!argContestType) {
			console.error("The -c or --contestType argument must be supplied.");
			process.exit();
		}
		this.contestType = utils.coerceContestType(argContestType);
		if (!this.contestType) {
			console.error("The -c or --contestType argument must be one of: " + utils.validContestTypes().join(", "));
			process.exit();
		}

		// Validate sport
		if (this.dataType === DataType.PlayerInsight) {
			if (!argSport) {
				console.error("The -s or --sport argument must be supplied.");
				process.exit();
			}
			this.sport = utils.coerceSport(argSport);
			if (!this.sport) {
				console.error("The -s or --sport argument must be one of: " + utils.validSports().join(", "));
				process.exit();
			}
		}
	}
}

const args: Args = new Args();
export = args;
