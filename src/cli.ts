#! /usr/bin/env node

import { DataType } from "./interfaces";
import args from "./args";
import insightData from "./data";
import utils from "./utils";

switch (args.dataType) {
    case DataType.ContestList:
        insightData.getContestList(args.contestType, args.sport).then((contests) => {
            console.log(JSON.stringify(contests));
        });
        break;
    case DataType.PlayerCard:
        insightData.getPlayerCard(args.contestType, args.contestID, args.playerID).then((playerCard) => {
            console.log(JSON.stringify(playerCard));
        });
        break;
    case DataType.PlayerInsight:
    default:
        insightData.getPlayerInsight(args.contestType, args.sport).then((players) => {
            console.log(JSON.stringify(players));
        });
        break;
}
