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
            const contest: IContest = { ID: "FD27134", contestType: ContestType.FanDuel, label: "Main", sport: Sport.MLB };
            const contestData = fs.readFileSync("spec-content/fanDuelContest.json", "utf-8");
            const expectedGames: IGame[] = [{
                awayTeam: {
                    code: "WAS",
                    fullName: "Washington Nationals"
                },
                homeTeam: {
                    code: "MIL",
                    fullName: "Milwaukee Brewers"
                },
                startTime: new Date(Date.UTC(2018, 6, 24, 0, 10))
            }, {
                awayTeam: {
                    code: "CWS",
                    fullName: "Chicago White Sox",
                },
                homeTeam: {
                    code: "LAA",
                    fullName: "Los Angeles Angels",
                },
                startTime: new Date(Date.UTC(2018, 6, 24, 2, 7))
            }, {
                awayTeam: {
                    code: "BOS",
                    fullName: "Boston Red Sox",
                },
                homeTeam: {
                    code: "BAL",
                    fullName: "Baltimore Orioles",
                },
                startTime: new Date(Date.UTC(2018, 6, 23, 23, 5))
            }, {
                awayTeam: {
                    code: "DET",
                    fullName: "Detroit Tigers",
                },
                homeTeam: {
                    code: "KAN",
                    fullName: "Kansas City Royals",
                },
                startTime: new Date(Date.UTC(2018, 6, 24, 0, 15))
            }, {
                awayTeam: {
                    code: "ARI",
                    fullName: "Arizona Diamondbacks",
                },
                homeTeam: {
                    code: "CHC",
                    fullName: "Chicago Cubs",
                },
                startTime: new Date(Date.UTC(2018, 6, 24, 0, 5))
            }, {
                awayTeam: {
                    code: "OAK",
                    fullName: "Oakland Athletics",
                },
                homeTeam: {
                    code: "TEX",
                    fullName: "Texas Rangers",
                },
                startTime: new Date(Date.UTC(2018, 6, 24, 0, 5))
            }, {
                awayTeam: {
                    code: "PIT",
                    fullName: "Pittsburgh Pirates",
                },
                homeTeam: {
                    code: "CLE",
                    fullName: "Cleveland Indians",
                },
                startTime: new Date(Date.UTC(2018, 6, 23, 23, 10))
            }, {
                awayTeam: {
                    code: "MIN",
                    fullName: "Minnesota Twins",
                },
                homeTeam: {
                    code: "TOR",
                    fullName: "Toronto Blue Jays",
                },
                startTime: new Date(Date.UTC(2018, 6, 23, 23, 7))
            }, {
                awayTeam: {
                    code: "LOS",
                    fullName: "Los Angeles Dodgers",
                },
                homeTeam: {
                    code: "PHI",
                    fullName: "Philadelphia Phillies",
                },
                startTime: new Date(Date.UTC(2018, 6, 23, 23, 5))
            }, {
                awayTeam: {
                    code: "NYY",
                    fullName: "New York Yankees",
                },
                homeTeam: {
                    code: "TAM",
                    fullName: "Tampa Bay Rays",
                },
                startTime: new Date(Date.UTC(2018, 6, 23, 23, 10))
            }, {
                awayTeam: {
                    code: "STL",
                    fullName: "St. Louis Cardinals",
                },
                homeTeam: {
                    code: "CIN",
                    fullName: "Cincinnati Reds",
                },
                startTime: new Date(Date.UTC(2018, 6, 23, 23, 10))
            }, {
                awayTeam: {
                    code: "SDP",
                    fullName: "San Diego Padres",
                },
                homeTeam: {
                    code: "NYM",
                    fullName: "New York Mets",
                },
                startTime: new Date(Date.UTC(2018, 6, 23, 23, 10))
            }, {
                awayTeam: {
                    code: "ATL",
                    fullName: "Atlanta Braves",
                },
                homeTeam: {
                    code: "MIA",
                    fullName: "Miami Marlins",
                },
                startTime: new Date(Date.UTC(2018, 6, 23, 23, 10))
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
            specUtils.assertContestEquals(contest, { ID: "FD27134", contestType: ContestType.FanDuel, label: "Main", maxPlayersPerTeam: 5, positions: expectedPositions, sport: Sport.MLB, games: expectedGames });
        });
    });

    describe("#parseContestPlayerList()", () => {
        it("should parse the contest player list retreived from FanDuel", () => {
            // Arrange
            const target = new FanDuelContestRetriever();
            const contest: IContest = { ID: "FD27134", contestType: ContestType.FanDuel, label: "Main", sport: Sport.MLB };
            const contestData = fs.readFileSync("spec-content/fanDuelContest.json", "utf-8");
            const playerListData = fs.readFileSync("spec-content/fanDuelPlayerList.json", "utf-8");
            target.parseContestSpecificData(contest, contestData);

            // Act
            target.parseContestPlayerList(contest, playerListData);

            // Assert
            specUtils.assertContainsPlayer(contest.games[0].awayTeam.players, { name: "Bryce Harper", team: "WAS", position: "OF", salary: 4100, isProbablePitcher: false, isStarter: false, battingOrder: "NA", stats: [{ source: "FanDuel", seasonAveragePoints: 12.039583841959635 }] });
            specUtils.assertContainsPlayer(contest.games[0].homeTeam.players, { name: "Jesus Aguilar", team: "MIL", position: "1B", salary: 4000, isProbablePitcher: false, isStarter: false, battingOrder: "NA", stats: [{ source: "FanDuel", seasonAveragePoints: 11.702247191011235 }] });
            specUtils.assertContainsPlayer(contest.games[12].awayTeam.players, { name: "Ozzie Albies", team: "ATL", position: "2B", salary: 4100, isProbablePitcher: false, isStarter: false, battingOrder: "NA", stats: [{ source: "FanDuel", seasonAveragePoints: 12.74468085106383 }] });
        });
    });
});
