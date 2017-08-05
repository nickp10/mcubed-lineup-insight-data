#! /usr/bin/env node

import { DataType } from "./interfaces";
import * as args from "./args";
import * as insightData from "./data";
import * as utils from "./utils";

switch (args.dataType) {
	case DataType.ContestList:
		insightData.getContestList(args.contestType, args.sport).then((contests) => {
			console.log(JSON.stringify(contests));
		});
		break;
	case DataType.PlayerInsight:
	default:
		insightData.getPlayerInsight(args.contestType, args.sport).then((players) => {
			console.log(JSON.stringify(players));
		});
		break;
}
