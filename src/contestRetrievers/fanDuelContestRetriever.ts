/// <reference path="../../typings/index.d.ts" />

import { IContestRetriever, IContest } from "../interfaces";
import * as utils from "../utils";

export default class FanDuelContestRetriever implements IContestRetriever {
	contests(): PromiseLike<IContest[]> {
		return utils.sendHttpsRequest({
			hostname: "api.fanduel.com",
			path: "/fixture-lists",
			method: "GET",
			headers: {
				"Authorization": "Basic N2U3ODNmMTE4OTIzYzE2NzVjNWZhYWFmZTYwYTc5ZmM6"
			}
		}).then((dataResp) => {
			return this.parseContests(dataResp.body);
		});
	}

	parseContests(data: string): IContest[] {
		const jsonData = JSON.parse(data);
		const returnContests: IContest[] = [];
		if (jsonData) {
			const contests = jsonData.fixture_lists;
			if (Array.isArray(contests)) {
				for (let i = 0; i < contests.length; i++) {
					const contest = contests[i];
					const fdContest: IContest = {
						ID: `FD${contest["id"]}`,
						label: contest["label"],
						contestType: "FanDuel",
						sport: contest["sport"],
						maxSalary: contest["salary_cap"],
						contestURL: contest["_url"],
						playersURL: contest["players"]["_url"],
						startTime: new Date(contest["start_date"])
					};
					returnContests.push(fdContest);
				}
			}
		}
		return returnContests;
	}
}
