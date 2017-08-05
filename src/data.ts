import { IContest, IContestListRetriever, IPlayer, IPlayerInsightRetriever, ContestType, Sport } from "./interfaces";
import DFSR from "./retrievers/dfsr";
import FanDuelContestRetriever from "./contestRetrievers/fanDuelContestRetriever";
import NumberFire from "./retrievers/numberFire";
import PlayerFactory from "./playerFactory";
import RGProjections from "./retrievers/rotogrinders/projections";
import RGRecent from "./retrievers/rotogrinders/recent";
import RGStarting from "./retrievers/rotogrinders/starting";
import * as utils from "./utils";

class Data {
	contestListRetrievers: IContestListRetriever[] = [
		new FanDuelContestRetriever()
	];
	playerInsightRetrievers: IPlayerInsightRetriever[] = [
		new DFSR(),
		new NumberFire(),
		new RGProjections(),
		new RGRecent(),
		new RGStarting()
	];

	getContestList(contestType: ContestType, sport: Sport): PromiseLike<IContest[]> {
		let retrievers = this.contestListRetrievers;
		if (contestType) {
			retrievers = retrievers.filter(r => r.contestType === contestType);
		}
		const promises = retrievers.map(r => r.contestList(sport));
		return Promise.all(promises).then((contests) => {
			return utils.flattenArray<IContest>(contests);
		});
	}

	getPlayerInsight(contestType: ContestType, sport: Sport): PromiseLike<IPlayer[]> {
		const promises = this.playerInsightRetrievers.map(r => r.playerInsight(contestType, sport));
		return Promise.all(promises).then((dataArray) => {
			let data: IPlayer[] = [];
			dataArray.forEach((dataItem) => {
				if (dataItem) {
					dataItem.forEach((player) => {
						// Only return players that have a specified salary. If the salary could not be determined,
						// then -1 should be used for the salary to allow the player's data to be returned.
						if (player.salary > 0 || player.salary === -1) {
							data.push(player);
						}
					});
				}
			});
			return data;
		});
	}
}

const data = new Data();
export = data;
