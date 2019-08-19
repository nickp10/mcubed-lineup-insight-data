import * as fs from "fs";
import FanDuelContestRetriever from "./fanDuelContestRetriever";
import { IContest, IGame, ContestType, Sport } from "../interfaces";
import specUtils from "../specUtils.spec";

describe("FanDuelContestRetriever", () => {
    describe("#parseContestList()", () => {
        it("should parse the contests retreived from FanDuel", () => {
            // Arrange
            const target = new FanDuelContestRetriever();
            const contestsData = fs.readFileSync("spec-content/fanDuelContestList.json", "utf-8");

            // Act
            const contests = target.parseContestList(contestsData, undefined);

            // Assert
            specUtils.assertContainsContest(contests, { ID: "FD27134", contestType: ContestType.FanDuel, label: "Main", maxSalary: 35000, sport: Sport.MLB, startTime: new Date(Date.UTC(2018, 6, 23, 23, 5)) });
            specUtils.assertContainsContest(contests, { ID: "FD27141", contestType: ContestType.FanDuel, label: "4x4 Main", maxSalary: 0, sport: Sport.MLB, startTime: new Date(Date.UTC(2018, 6, 23, 23, 5)) });
        });
    });

    describe("#parseContestSpecificData()", () => {
        it("should parse the specific contest data retreived from FanDuel", () => {
            // Arrange
            const target = new FanDuelContestRetriever();
            const contest: IContest = { ID: "FD37771", contestType: ContestType.FanDuel, label: "Main", sport: Sport.MLB };
            const contestData = fs.readFileSync("spec-content/fanDuelContest.json", "utf-8");
            const expectedGames: IGame[] = [{
                awayTeam: {
                    code: "CWS",
                    fullName: "Chicago White Sox"
                },
                homeTeam: {
                    code: "MIN",
                    fullName: "Minnesota Twins"
                },
                startTime: new Date(Date.UTC(2019, 7, 20, 0, 10))
            }, {
                awayTeam: {
                    code: "DET",
                    fullName: "Detroit Tigers",
                },
                homeTeam: {
                    code: "HOU",
                    fullName: "Houston Astros",
                },
                startTime: new Date(Date.UTC(2019, 7, 20, 0, 10))
            }, {
                awayTeam: {
                    code: "COL",
                    fullName: "Colorado Rockies",
                },
                homeTeam: {
                    code: "ARI",
                    fullName: "Arizona Diamondbacks",
                },
                startTime: new Date(Date.UTC(2019, 7, 20, 1, 40))
            }, {
                awayTeam: {
                    code: "LAA",
                    fullName: "Los Angeles Angels",
                },
                homeTeam: {
                    code: "TEX",
                    fullName: "Texas Rangers",
                },
                startTime: new Date(Date.UTC(2019, 7, 20, 0, 5))
            }, {
                awayTeam: {
                    code: "MIL",
                    fullName: "Milwaukee Brewers",
                },
                homeTeam: {
                    code: "STL",
                    fullName: "St. Louis Cardinals",
                },
                startTime: new Date(Date.UTC(2019, 7, 19, 23, 45))
            }, {
                awayTeam: {
                    code: "KAN",
                    fullName: "Kansas City Royals",
                },
                homeTeam: {
                    code: "BAL",
                    fullName: "Baltimore Orioles",
                },
                startTime: new Date(Date.UTC(2019, 7, 19, 23, 5))
            }, {
                awayTeam: {
                    code: "WAS",
                    fullName: "Washington Nationals",
                },
                homeTeam: {
                    code: "PIT",
                    fullName: "Pittsburgh Pirates",
                },
                startTime: new Date(Date.UTC(2019, 7, 19, 23, 5))
            }, {
                awayTeam: {
                    code: "SDP",
                    fullName: "San Diego Padres",
                },
                homeTeam: {
                    code: "CIN",
                    fullName: "Cincinnati Reds",
                },
                startTime: new Date(Date.UTC(2019, 7, 19, 23, 10))
            }, {
                awayTeam: {
                    code: "SEA",
                    fullName: "Seattle Mariners",
                },
                homeTeam: {
                    code: "TAM",
                    fullName: "Tampa Bay Rays",
                },
                startTime: new Date(Date.UTC(2019, 7, 19, 23, 10))
            }];
            const expectedPositions = [
                {
                    eligiblePlayerPositions: ["P"],
                    label: "P"
                },
                {
                    eligiblePlayerPositions: ["1B", "C"],
                    label: "C/1B"
                },
                {
                    eligiblePlayerPositions: ["2B"],
                    label: "2B"
                },
                {
                    eligiblePlayerPositions: ["3B"],
                    label: "3B"
                },
                {
                    eligiblePlayerPositions: ["SS"],
                    label: "SS"
                },
                {
                    eligiblePlayerPositions: ["OF"],
                    label: "OF"
                },
                {
                    eligiblePlayerPositions: ["OF"],
                    label: "OF"
                },
                {
                    eligiblePlayerPositions: ["OF"],
                    label: "OF"
                },
                {
                    eligiblePlayerPositions: ["2B", "SS", "1B", "C", "OF", "3B"],
                    label: "UTIL"
                }
            ];

            // Act
            target.parseContestSpecificData(contest, contestData);

            // Assert
            specUtils.assertContestEquals(contest, { ID: "FD37771", contestType: ContestType.FanDuel, label: "Main", maxPlayersPerTeam: 5, positions: expectedPositions, sport: Sport.MLB, games: expectedGames });
        });
    });

    describe("#parseContestPlayerList()", () => {
        it("should parse the contest player list retreived from FanDuel", () => {
            // Arrange
            const target = new FanDuelContestRetriever();
            const contest: IContest = { ID: "FD37771", contestType: ContestType.FanDuel, label: "Main", sport: Sport.MLB };
            const contestData = fs.readFileSync("spec-content/fanDuelContest.json", "utf-8");
            const playerListData = fs.readFileSync("spec-content/fanDuelPlayerList.json", "utf-8");
            target.parseContestSpecificData(contest, contestData);

            // Act
            target.parseContestPlayerList(contest, playerListData);

            // Assert
            specUtils.assertContainsPlayer(contest.games[6].awayTeam.players, { name: "Max Scherzer", team: "WAS", position: "P", salary: 12000, isProbablePitcher: false, isStarter: false, battingOrder: "NA", stats: [{ source: "FanDuel", seasonAveragePoints: 46.666666666666667 }] });
            specUtils.assertContainsPlayer(contest.games[6].homeTeam.players, { name: "Josh Bell", team: "PIT", position: "1B", salary: 4100, isProbablePitcher: false, isStarter: false, battingOrder: "NA", stats: [{ source: "FanDuel", seasonAveragePoints: 13.371186854475635 }] });
            specUtils.assertContainsPlayer(contest.games[8].homeTeam.players, { name: "Brandon Lowe", team: "TAM", position: "2B", salary: 3400, isProbablePitcher: false, isStarter: false, battingOrder: "NA", stats: [{ source: "FanDuel", seasonAveragePoints: 11.164473684210526 }] });
        });
    });
});
