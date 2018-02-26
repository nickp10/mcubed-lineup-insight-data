import { ContestType, DataType, Sport } from "./interfaces";
import * as argv from "argv";
import utils from "./utils";

export class Args {
	dataType: DataType;
	contestType: ContestType;
	sport: Sport;
	contestID: string;
	playerID: string;

	constructor() {
		const args = argv
			.option({ name: "data", short: "d", type: "string" })
			.option({ name: "contestType", short: "c", type: "string" })
			.option({ name: "sport", short: "s", type: "string" })
			.option({ name: "contestID", type: "string" })
			.option({ name: "playerID", type: "string" })
			.run();
		const argData = args.options["data"];
		const argContestType = args.options["contestType"];
		const argSport = args.options["sport"];
		const argContestID = args.options["contestID"];
		const argPlayerID = args.options["playerID"];
		this.validate(argData, argContestType, argSport, argContestID, argPlayerID);
	}

	validate(argDataType: string, argContestType: string, argSport: string, argContestID: string, argPlayerID: string): void {
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

		// Validate contest and player IDs
		if (this.dataType === DataType.PlayerCard) {
			if (!argContestID) {
				console.error("The --contestID argument must be supplied.");
				process.exit();
			}
			this.contestID = argContestID;
			if (!argPlayerID) {
				console.error("The --playerID argument must be supplied.");
				process.exit();
			}
			this.playerID = argPlayerID;
		}
	}
}

const args: Args = new Args();
export default args;
