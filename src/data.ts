import { IDataRetriever, ISiteDataRetriever, IPlayer } from "./interfaces";
import DFSR from "./retrievers/dfsr";
import NumberFire from "./retrievers/numberFire";
import PlayerFactory from "./playerFactory";
import RGProjections from "./retrievers/rotogrinders/projections";
import RGRecent from "./retrievers/rotogrinders/recent";
import RGStarting from "./retrievers/rotogrinders/starting";
import * as utils from "./utils";

class Data {
	retrievers: IDataRetriever[] = [
		new DFSR(),
		new NumberFire(),
		new RGProjections(),
		new RGRecent(),
		new RGStarting()
	];

	getData(contestType: string, sport: string): Promise.IThenable<IPlayer[]> {
		contestType = utils.coerceContestType(contestType);
		sport = utils.coerceSport(sport);
		const promises: Promise.IThenable<IPlayer[]>[] = [];
		this.retrievers.forEach((retriever) => {
			const siteRetriever: ISiteDataRetriever = retriever[contestType];
			if (siteRetriever) {
				const sportRetriever: (playerFactory: PlayerFactory) => Promise.IThenable<IPlayer[]> = siteRetriever[sport];
				if (sportRetriever) {
					const playerFactory = new PlayerFactory(sport);
					const retrieverPromise = sportRetriever(playerFactory);
					if (retrieverPromise) {
						promises.push(retrieverPromise);
					}
				}
			}
		});
		return Promise.all(promises).then((dataArray: IPlayer[][]) => {
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
