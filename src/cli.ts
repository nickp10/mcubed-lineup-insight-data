#! /usr/bin/env node
/// <reference path="../typings/index.d.ts" />

import * as args from "./args";
import * as insightData from "./data";

insightData.getData(args.contestType, args.sport).then((players) => {
	console.log(JSON.stringify(players));
});
