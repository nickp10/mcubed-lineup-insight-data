import * as assert from "assert";
import * as fs from "fs";
import FanDuelContestRetriever from "../../src/contestRetrievers/fanDuelContestRetriever";
import { IContest, IGame, ITeam } from "../../src/interfaces";
import * as testUtils from "../testUtils";

describe("FanDuelContestRetriever", () => {
	describe("#parseContests()", () => {
		it("should parse the contests retreived from FanDuel", () => {
			// Arrange
			const target = new FanDuelContestRetriever();
			const contestsData = fs.readFileSync("test/content/fanDuelContestList.json", "utf-8");

			// Act
			const contests = target.parseContests(contestsData);

			// Assert
			testUtils.assertContainsContest(contests, { ID: "FD19809", contestType: "fanDuel", label: "Early Only", maxSalary: 35000, sport: "mlb", startTime: new Date(Date.UTC(2017, 5, 22, 17, 5)) });
			testUtils.assertContainsContest(contests, { ID: "FD19811", contestType: "fanDuel", label: "Main", maxSalary: 35000, sport: "mlb", startTime: new Date(Date.UTC(2017, 5, 22, 23, 5)) });
		});
	});

	describe("#parseContestSpecificData()", () => {
		it("should parse the specific contest data retreived from FanDuel", () => {
			// Arrange
			const target = new FanDuelContestRetriever();
			const contest: IContest = { ID: "FD19809", contestType: "fanDuel", label: "Early Only", sport: "mlb" };
			const contestData = fs.readFileSync("test/content/fanDuelContest.json", "utf-8");
			const expectedGames: IGame[] = [{
				awayTeam: {
					code: "TOR",
					fullName: "Toronto Blue Jays"
				},
				homeTeam: {
					code: "TEX",
					fullName: "Texas Rangers"
				},
				startTime: new Date(Date.UTC(2017, 5, 22, 18, 5))
			}, {
				awayTeam: {
					code: "ARI",
					fullName: "Arizona Diamondbacks",
				},
				homeTeam: {
					code: "COL",
					fullName: "Colorado Rockies",
				},
				startTime: new Date(Date.UTC(2017, 5, 22, 19, 10))
			}, {
				awayTeam: {
					code: "STL",
					fullName: "St. Louis Cardinals",
				},
				homeTeam: {
					code: "PHI",
					fullName: "Philadelphia Phillies",
				},
				startTime: new Date(Date.UTC(2017, 5, 22, 17, 5))
			}, {
				awayTeam: {
					code: "PIT",
					fullName: "Pittsburgh Pirates",
				},
				homeTeam: {
					code: "MIL",
					fullName: "Milwaukee Brewers",
				},
				startTime: new Date(Date.UTC(2017, 5, 22, 18, 10))
			}, {
				awayTeam: {
					code: "CWS",
					fullName: "Chicago White Sox",
				},
				homeTeam: {
					code: "MIN",
					fullName: "Minnesota Twins",
				},
				startTime: new Date(Date.UTC(2017, 5, 22, 17, 10))
			}, {
				awayTeam: {
					code: "HOU",
					fullName: "Houston Astros",
				},
				homeTeam: {
					code: "OAK",
					fullName: "Oakland Athletics",
				},
				startTime: new Date(Date.UTC(2017, 5, 22, 19, 35))
			}];

			// Act
			target.parseContestSpecificData(contest, contestData);

			// Assert
			testUtils.assertContestEquals(contest, { ID: "FD19809", contestType: "fanDuel", label: "Early Only", maxPlayersPerTeam: 4, positions: ["P", "C", "1B", "2B", "3B", "SS", "OF", "OF", "OF"], sport: "mlb", games: expectedGames });
		});
	});

	describe("#parseContestPlayerList()", () => {
		it("should parse the contest player list retreived from FanDuel", () => {
			// Arrange
			const target = new FanDuelContestRetriever();
			const contest: IContest = { ID: "FD19809", contestType: "fanDuel", label: "Early Only", sport: "mlb" };
			const contestData = fs.readFileSync("test/content/fanDuelContest.json", "utf-8");
			const playerListData = fs.readFileSync("test/content/fanDuelPlayerList.json", "utf-8");
			target.parseContestSpecificData(contest, contestData);

			// Act
			target.parseContestPlayerList(contest, playerListData);

			// Assert
			testUtils.assertContainsPlayer(contest.games[0].awayTeam.players, { name: "Josh Donaldson", team: "TOR", position: "3B", salary: 3900 });
			testUtils.assertContainsPlayer(contest.games[0].homeTeam.players, { name: "Adrian Beltre", team: "TEX", position: "3B", salary: 3800 });
			testUtils.assertContainsPlayer(contest.games[5].awayTeam.players, { name: "Jose Altuve", team: "HOU", position: "2B", salary: 4000 });
		});
	});
});
