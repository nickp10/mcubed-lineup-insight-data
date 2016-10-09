import { IDataRetriever, ISiteDataRetriever, IPlayer } from "./interfaces";
import DFSR from "./retrievers/dfsr";
import NumberFire from "./retrievers/numberFire";

class Data {
	retrievers: IDataRetriever[] = [
		new DFSR(),
		new NumberFire()
	];

	getData(contestType: string, sport: string): Promise.IThenable<IPlayer[]> {
		const promises: Promise.IThenable<IPlayer[]>[] = [];
		this.retrievers.forEach((retriever) => {
			const siteRetriever: ISiteDataRetriever = retriever[contestType];
			if (siteRetriever) {
				const sportRetriever: () => Promise.IThenable<IPlayer[]> = siteRetriever[sport];
				if (sportRetriever) {
					const retrieverPromise = sportRetriever();
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
					data = data.concat(dataItem);
				}
			});
			return data;
		});
	}
}

const data = new Data();
export = data;
