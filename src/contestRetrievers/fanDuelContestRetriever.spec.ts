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
            specUtils.assertContainsPlayer(contest.games[6].awayTeam.players, {
                ID: "5481",
                name: "Max Scherzer",
                team: "WAS",
                position: "P",
                positionEligibility: ["P"],
                salary: 12000,
                isStarter: false,
                mlbSpecific: { battingOrder: "NA", handednessBat: "R", handednessThrow: "R", isProbablePitcher: false },
                stats: [{ source: "FanDuel", seasonAveragePoints: 46.666666666666667 }],
                thumbnailURL: "https://d17odppiik753x.cloudfront.net/playerimages/mlb/5481.png"
            });
            specUtils.assertContainsPlayer(contest.games[6].homeTeam.players, {
                ID: "53994",
                name: "Josh Bell",
                team: "PIT",
                position: "1B",
                positionEligibility: ["C/1B", "UTIL"],
                salary: 4100,
                isStarter: false,
                mlbSpecific: { battingOrder: "NA", handednessBat: "S", handednessThrow: "R", isProbablePitcher: false },
                stats: [{ source: "FanDuel", seasonAveragePoints: 13.371186854475635 }],
                thumbnailURL: "https://d17odppiik753x.cloudfront.net/playerimages/mlb/53994.png"
            });
            specUtils.assertContainsPlayer(contest.games[8].homeTeam.players, {
                ID: "85504",
                name: "Brandon Lowe",
                team: "TAM",
                position: "2B",
                positionEligibility: ["2B", "UTIL"],
                salary: 3400,
                isStarter: false,
                mlbSpecific: { battingOrder: "NA", handednessBat: "L", handednessThrow: "R", isProbablePitcher: false },
                stats: [{ source: "FanDuel", seasonAveragePoints: 11.164473684210526 }],
                thumbnailURL: "https://d17odppiik753x.cloudfront.net/playerimages/mlb/85504.png"
            });
        });

        it("should parse an unordinary contest player list (Gemini Man) retreived from FanDuel", () => {
            // Arrange
            const target = new FanDuelContestRetriever();
            const contest: IContest = { ID: "FD38553", contestType: ContestType.FanDuel, label: "Gemini Man", sport: Sport.NFL };
            const contestData = fs.readFileSync("spec-content/fanDuelGeminiContest.json", "utf-8");
            const playerListData = fs.readFileSync("spec-content/fanDuelGeminiPlayerList.json", "utf-8");
            target.parseContestSpecificData(contest, contestData);

            // Act
            target.parseContestPlayerList(contest, playerListData);

            // Assert
            specUtils.assertContainsPlayer(contest.games[0].awayTeam.players, {
                ID: "34331",
                name: "Latavius Murray",
                team: "NO",
                position: "RB",
                positionEligibility: ["Sr RB"],
                salary: 0,
                isStarter: false,
                stats: [{ source: "FanDuel", seasonAveragePoints: 7.25 }],
                thumbnailURL: "https://d17odppiik753x.cloudfront.net/playerimages/nfl/34331.png"
            });
            specUtils.assertContainsPlayer(contest.games[3].awayTeam.players, {
                ID: "55050",
                name: "Christian McCaffrey",
                team: "CAR",
                position: "RB",
                positionEligibility: ["Jr RB"],
                salary: 0,
                isStarter: false,
                stats: [{ source: "FanDuel", seasonAveragePoints: 22.100000381469727 }],
                thumbnailURL: "https://d17odppiik753x.cloudfront.net/playerimages/nfl/55050.png"
            });
        });
    });
});
