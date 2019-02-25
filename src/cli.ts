import { DataType } from "./interfaces";
import args from "./args";
import insightData from "./data";

async function main(): Promise<void> {
    try {
        switch (args.dataType) {
            case DataType.ContestList:
                const contests = await insightData.getContestList(args.contestType, args.sport);
                console.log(JSON.stringify(contests));
                break;
            case DataType.PlayerCard:
                const playerCard = await insightData.getPlayerCard(args.contestType, args.contestID, args.playerID);
                console.log(JSON.stringify(playerCard));
                break;
            case DataType.PlayerInsight:
            default:
                const players = await insightData.getPlayerInsight(args.contestType, args.sport);
                console.log(JSON.stringify(players));
                break;
        }
    } catch (error) {
        console.error(JSON.stringify({ message: error.message }));
    }
}

main();
