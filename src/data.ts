import { IContest, IContestListRetriever, IPlayer, IPlayerCard, IPlayerCardRetriever, IPlayerInsightRetriever, ContestType, Sport, ITeamInsight, ITeamInsightRetriever } from "./interfaces";
import DFSR from "./retrievers/dfsr";
import FanDuelContestRetriever from "./contestRetrievers/fanDuelContestRetriever";
import FanDuelPlayerCardRetriever from "./playerCardRetrievers/fanDuelPlayerCardRetriever";
import NumberFire from "./retrievers/numberFire";
import RGProjections from "./retrievers/rotogrinders/projections";
import RGRecent from "./retrievers/rotogrinders/recent";
import RGStarting from "./retrievers/rotogrinders/starting";
import RGTeamInsight from "./teamInsightRetrievers/rgTeamInsight";
import utils from "./utils";

export class Data {
    private contestListRetrievers: IContestListRetriever[] = [
        new FanDuelContestRetriever()
    ];
    private playerCardRetrievers: IPlayerCardRetriever[] = [
        new FanDuelPlayerCardRetriever()
    ];
    private playerInsightRetrievers: IPlayerInsightRetriever[] = [
        new DFSR(),
        new NumberFire(),
        new RGProjections(),
        new RGRecent(),
        new RGStarting()
    ];
    private teamInsightRetrievers: ITeamInsightRetriever[] = [
        new RGTeamInsight()
    ];

    async getContestList(contestType?: ContestType, sport?: Sport): Promise<IContest[]> {
        try {
            let retrievers = this.contestListRetrievers;
            if (contestType) {
                retrievers = retrievers.filter(r => r.contestType === contestType);
            }
            const contests: IContest[] = [];
            for (const retriever of retrievers) {
                const contestList = await retriever.contestList(sport);
                contests.push.apply(contests, contestList);
            }
            return contests;
        } catch (error) {
            throw utils.coerceError(error);
        }
    }

    async getPlayerCard(contestType: ContestType, contestID: string, playerID: string): Promise<IPlayerCard> {
        try {
            const retriever = this.playerCardRetrievers.find(r => r.contestType === contestType);
            if (retriever) {
                return await retriever.playerCard(contestID, playerID);
            }
            return undefined;
        } catch (error) {
            throw utils.coerceError(error);
        }
    }

    async getPlayerInsight(contestType: ContestType, sport: Sport): Promise<IPlayer[]> {
        try {
            const data: IPlayer[] = [];
            for (const retriever of this.playerInsightRetrievers) {
                const players = await retriever.playerInsight(contestType, sport);
                for (const player of players) {
                    // Only return players that have a specified salary. If the salary could not be determined,
                    // then -1 should be used for the salary to allow the player's data to be returned.
                    if (player.salary > 0 || player.salary === -1) {
                        data.push(player);
                    }
                }
            }
            return data;
        } catch (error) {
            throw utils.coerceError(error);
        }
    }

    async getTeamInsight(contestType: ContestType, sport: Sport): Promise<ITeamInsight[]> {
        try {
            const data: ITeamInsight[] = [];
            for (const teamInsightRetriever of this.teamInsightRetrievers) {
                const teamInsight = await teamInsightRetriever.teamInsight(contestType, sport);
                data.push.apply(data, teamInsight);
            }
            return data;
        } catch (error) {
            throw utils.coerceError(error);
        }
    }
}

export default new Data();
