import { IContestRetriever, IContest } from "../interfaces";
import * as utils from "../utils";

export default class FanDuelContestRetriever implements IContestRetriever {
	contests(): PromiseLike<IContest[]> {
		return new Promise<IContest[]>((resolve, reject) => {
			utils.sendHttpsRequest({
				hostname: "api.fanduel.com",
				path: "/fixture-lists",
				method: "GET",
				headers: {
					"Authorization": "Basic N2U3ODNmMTE4OTIzYzE2NzVjNWZhYWFmZTYwYTc5ZmM6"
				}
			}).then((dataResp) => {
				const promises: PromiseLike<IContest>[] = [];
				const contests = this.parseContests(dataResp.body);
				for (let i = 0; i < contests.length; i++) {
					const contest = contests[i];
					promises.push(this.getContestSpecificData(contest).then(contestData => {
						this.parseContestSpecificData(contest, contestData);
						return contest;
					}));
				}
				Promise.all(promises).then((c) => resolve(c));
			});
		});
	}

	getContestSpecificData(contest: IContest): PromiseLike<string> {
		return utils.sendHttpsRequest({
			hostname: "api.fanduel.com",
			path: contest.contestURL.replace("https://api.fanduel.com", ""),
			method: "GET",
			headers: {
				"Authorization": "Basic N2U3ODNmMTE4OTIzYzE2NzVjNWZhYWFmZTYwYTc5ZmM6"
			}
		}).then((dataResp) => {
			return dataResp.body;
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

	parseContestSpecificData(fdContest: IContest, contestData: string): void {
		const jsonData = JSON.parse(contestData);
		if (jsonData) {
			const contests = jsonData.fixture_lists;
			if (Array.isArray(contests)) {
				const contest = contests.find((c) => `FD${c["id"]}` === fdContest.ID);
				if (contest) {
					fdContest.maxPlayersPerTeam = contest["roster_restrictions"]["max_players_from_team"];
					const positions = contest["roster_positions"];
					if (Array.isArray(positions)) {
						fdContest.positions = positions.map(p => p["abbr"]);
					}
				}
			}
		}
	}
}
