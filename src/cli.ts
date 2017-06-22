#! /usr/bin/env node

import * as args from "./args";
import * as insightData from "./data";

insightData.getData(args.contestType, args.sport).then((players) => {
	console.log(JSON.stringify(players));
});
