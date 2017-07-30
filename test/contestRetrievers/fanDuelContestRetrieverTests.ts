import * as fs from "fs";
import FanDuelContestRetriever from "../../src/contestRetrievers/fanDuelContestRetriever";
import { IContest } from "../../src/interfaces";
import * as testUtils from "../testUtils";

describe("FanDuelContestRetriever", () => {
	describe("#parseContests()", () => {
		it("should parse the contests retreived from FanDuel", () => {
			// Arrange
			const target = new FanDuelContestRetriever();
			const contestsData = fs.readFileSync("test/content/fanDuelContests.json", "utf-8");

			// Act
			const contests = target.parseContests(contestsData);

			// Assert
			testUtils.assertContainsContest(contests, { ID: "FD19809", contestType: "FanDuel", contestURL: "https://api.fanduel.com/fixture-lists/19809", label: "Early Only", maxSalary: 35000, playersURL: "https://api.fanduel.com/fixture-lists/19809/players", sport: "MLB", startTime: new Date(Date.UTC(2017, 5, 22, 17, 5)) });
			testUtils.assertContainsContest(contests, { ID: "FD19811", contestType: "FanDuel", contestURL: "https://api.fanduel.com/fixture-lists/19811", label: "Main", maxSalary: 35000, playersURL: "https://api.fanduel.com/fixture-lists/19811/players", sport: "MLB", startTime: new Date(Date.UTC(2017, 5, 22, 23, 5)) });
		});
	});

	describe("#parseContestSpecificData()", () => {
		it("should parse the specific contest data retreived from FanDuel", () => {
			// Arrange
			const target = new FanDuelContestRetriever();
			const contest: IContest = { ID: "FD19809", contestType: "FanDuel", label: "Early Only", sport: "MLB" };
			const contestData = fs.readFileSync("test/content/fanDuelContest.json", "utf-8");

			// Act
			target.parseContestSpecificData(contest, contestData);

			// Assert
			testUtils.assertContestEquals(contest, { ID: "FD19809", contestType: "FanDuel", label: "Early Only", maxPlayersPerTeam: 4, positions: ["P", "C", "1B", "2B", "3B", "SS", "OF", "OF", "OF"], sport: "MLB" });
		});
	});
});
