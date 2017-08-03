#! /usr/bin/env node

import * as args from "./args";
import * as insightData from "./data";
import * as utils from "./utils";

switch (args.data) {
	case utils.DATA_CONTESTS:
		insightData.getContests(args.contestType).then((contests) => {
			console.log(JSON.stringify(contests));
		});
		break;
	case utils.DATA_INSIGHT:
	default:
		insightData.getInsight(args.contestType, args.sport).then((players) => {
			console.log(JSON.stringify(players));
		});
		break;
}

