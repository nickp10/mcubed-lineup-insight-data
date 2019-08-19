import { IContest, IGame, IPlayer, IPlayerCard, IPlayerMLBSpecific, ITeam, ITeamInsight } from "./interfaces";
import * as assert from "assert";

export class SpecUtils {
    /**
     * Asserts that a player is contained in an array of players. It will also verify each of the
     * properties on the player to ensure they match with the player in the array.
     * 
     * @param actualPlayers The array of players to search through.
     * @param expectedPlayer The player that is expected to be found in the array of players.
     */
    assertContainsPlayer(actualPlayers: IPlayer[], expectedPlayer: IPlayer): void {
        const matchingPlayers = actualPlayers.filter(p => p.name === expectedPlayer.name);
        assert.strictEqual(matchingPlayers.length, 1, `No players match with name: ${expectedPlayer.name}`);
        const actualPlayer = matchingPlayers[0];
        this.assertPlayerEquals(actualPlayer, expectedPlayer);
    }

    /**
     * Asserts that a contest is contained in an array of contests. It will also verify each of the
     * properties on the contest to ensure they match with the contest in the array.
     * 
     * @param actualContests The array of contests to search through.
     * @param expectedContest The contest that is expected to be found in the array of contests.
     */
    assertContainsContest(actualContests: IContest[], expectedContest: IContest): void {
        const matchingContests = actualContests.filter(c => c.ID === expectedContest.ID);
        assert.strictEqual(matchingContests.length, 1, `No contests match with ID: ${expectedContest.ID}`);
        const actualContest = matchingContests[0];
        this.assertContestEquals(actualContest, expectedContest);
    }

    /**
     * Asserts that the actual contest matches the expected contest.
     * 
     * @param actualContest The actual contest to assert.
     * @param expectedContest The expected contest to assert.
     */
    assertContestEquals(actualContest: IContest, expectedContest: IContest): void {
        assert.strictEqual(actualContest.contestType, expectedContest.contestType);
        assert.strictEqual(actualContest.label, expectedContest.label);
        assert.strictEqual(actualContest.maxPlayersPerTeam, expectedContest.maxPlayersPerTeam);
        assert.strictEqual(actualContest.maxSalary, expectedContest.maxSalary);
        assert.strictEqual(actualContest.sport, expectedContest.sport);
        assert.deepStrictEqual(actualContest.startTime, expectedContest.startTime);
        if (expectedContest.positions) {
            assert.strictEqual(actualContest.positions.length, expectedContest.positions.length);
            for (let i = 0; i < actualContest.positions.length; i++) {
                const actualPosition = actualContest.positions[i];
                const expectedPosition = expectedContest.positions[i];
                assert.strictEqual(actualPosition.label, expectedPosition.label);
                if (expectedPosition.eligiblePlayerPositions) {
                    assert.strictEqual(actualPosition.eligiblePlayerPositions.length, expectedPosition.eligiblePlayerPositions.length);
                    for (let j = 0; j < actualPosition.eligiblePlayerPositions.length; j++) {
                        assert.strictEqual(actualPosition.eligiblePlayerPositions[i], expectedPosition.eligiblePlayerPositions[i]);
                    }
                } else {
                    assert.strictEqual(actualPosition.eligiblePlayerPositions, undefined);
                }
            }
        } else {
            assert.strictEqual(actualContest.positions, undefined);
        }
        if (expectedContest.games) {
            assert.strictEqual(actualContest.games.length, expectedContest.games.length);
            for (let i = 0; i < actualContest.games.length; i++) {
                this.assertGameEquals(actualContest.games[i], expectedContest.games[i]);
            }
        } else {
            assert.strictEqual(actualContest.games, undefined);
        }
    }

    /**
     * Asserts that the actual game matches the expected game.
     * 
     * @param actualGame The actual game to assert.
     * @param expectedGame The expected game to assert.
     */
    assertGameEquals(actualGame: IGame, expectedGame: IGame): void {
        this.assertTeamEquals(actualGame.awayTeam, expectedGame.awayTeam);
        this.assertTeamEquals(actualGame.homeTeam, expectedGame.homeTeam);
        assert.deepStrictEqual(actualGame.startTime, expectedGame.startTime);
    }

    /**
     * Asserts that the actual team matches the expected team.
     * 
     * @param actualTeam The actual team to assert.
     * @param expectedTeam The expected team to assert.
     */
    assertTeamEquals(actualTeam: ITeam, expectedTeam: ITeam): void {
        assert.strictEqual(actualTeam.code, expectedTeam.code);
        assert.strictEqual(actualTeam.fullName, expectedTeam.fullName);
        if (expectedTeam.players) {
            assert.strictEqual(actualTeam.players.length, expectedTeam.players.length);
            for (let i = 0; i < actualTeam.players.length; i++) {
                this.assertPlayerEquals(actualTeam.players[i], expectedTeam.players[i]);
            }
        } else {
            assert.strictEqual(actualTeam.players, undefined);
        }
    }

    /**
     * Asserts that the actual player matches the expected player.
     * 
     * @param actualPlayer The actual player to assert.
     * @param expectedPlayer The expected player to assert.
     */
    assertPlayerEquals(actualPlayer: IPlayer, expectedPlayer: IPlayer): void {
        assert.strictEqual(actualPlayer.team, expectedPlayer.team);
        assert.strictEqual(actualPlayer.salary, expectedPlayer.salary);
        assert.strictEqual(actualPlayer.isStarter, expectedPlayer.isStarter);
        assert.strictEqual(actualPlayer.position, expectedPlayer.position);
        this.assertPlayerMLBSpecificEquals(actualPlayer.mlbSpecific, expectedPlayer.mlbSpecific);
        if (expectedPlayer.stats) {
            assert.strictEqual(actualPlayer.stats.length, expectedPlayer.stats.length);
            for (let i = 0; i < actualPlayer.stats.length; i++) {
                const actualStats = actualPlayer.stats[i];
                const expectedStats = expectedPlayer.stats[i];
                assert.strictEqual(actualStats.source, expectedStats.source);
                assert.strictEqual(actualStats.projectedCeiling, expectedStats.projectedCeiling);
                assert.strictEqual(actualStats.projectedFloor, expectedStats.projectedFloor);
                assert.strictEqual(actualStats.projectedPoints, expectedStats.projectedPoints);
                assert.strictEqual(actualStats.recentAveragePoints, expectedStats.recentAveragePoints);
                assert.strictEqual(actualStats.seasonAveragePoints, expectedStats.seasonAveragePoints);
            }
        } else {
            assert.strictEqual(actualPlayer.stats, undefined);
        }
    }

    /**
     * Asserts that the actual specific MLB player data matches the expected specific MLB player data.
     * 
     * @param actual The actual MLB player data to assert.
     * @param expected The expected MLB player data to assert.
     */
    assertPlayerMLBSpecificEquals(actual: IPlayerMLBSpecific, expected: IPlayerMLBSpecific): void {
        if (expected) {
            assert.notStrictEqual(actual, undefined);
            assert.strictEqual(actual.battingOrder, expected.battingOrder);
            assert.strictEqual(actual.handednessBat, expected.handednessBat);
            assert.strictEqual(actual.handednessThrow, expected.handednessThrow);
            assert.strictEqual(actual.isProbablePitcher, expected.isProbablePitcher);
        } else {
            assert.strictEqual(actual, undefined);
        }
    }

    /**
     * Asserts that the actual player card matches the expected player card.
     * 
     * @param actualPlayerCard The actual player card to assert.
     * @param expectedPlayerCard The expected player card to assert.
     */
    assertPlayerCardEquals(actualPlayerCard: IPlayerCard, expectedPlayerCard: IPlayerCard): void {
        if (expectedPlayerCard.gameLog) {
            assert.strictEqual(actualPlayerCard.gameLog.length, expectedPlayerCard.gameLog.length);
            for (let i = 0; i < actualPlayerCard.gameLog.length; i++) {
                const actualGameLog = actualPlayerCard.gameLog[i];
                const expectedGameLog = expectedPlayerCard.gameLog[i];
                assert.deepStrictEqual(actualGameLog.date, expectedGameLog.date);
                assert.strictEqual(actualGameLog.opponent, expectedGameLog.opponent);
                assert.strictEqual(actualGameLog.points, expectedGameLog.points);
            }
        } else {
            assert.strictEqual(actualPlayerCard.gameLog, undefined);
        }
        if (expectedPlayerCard.news) {
            assert.strictEqual(actualPlayerCard.news.length, expectedPlayerCard.news.length);
            for (let i = 0; i < actualPlayerCard.news.length; i++) {
                const actualNews = actualPlayerCard.news[i];
                const expectedNews = expectedPlayerCard.news[i];
                assert.deepStrictEqual(actualNews.date, expectedNews.date);
                assert.strictEqual(actualNews.details, expectedNews.details);
                assert.strictEqual(actualNews.summary, expectedNews.summary);
            }
        } else {
            assert.strictEqual(actualPlayerCard.news, undefined);
        }
    }

    /**
     * Asserts that a team insight is contained in an array of team insights. It will also verify each of the
     * properties on the team insight to ensure they match with the team insight in the array.
     * 
     * @param actualTeamInsights The array of team insights to search through.
     * @param expectedTeamInsight The team isnight that is expected to be found in the array of team insights.
     */
    assertContainsTeamInsight(actualTeamInsights: ITeamInsight[], expectedTeamInsight: ITeamInsight): void {
        const matchingTeamInsights = actualTeamInsights.filter(c => c.code === expectedTeamInsight.code);
        assert.strictEqual(matchingTeamInsights.length, 1, `No team insights match with team code: ${expectedTeamInsight.code}`);
        const actualTeamInsight = matchingTeamInsights[0];
        this.assertTeamInsightEquals(actualTeamInsight, expectedTeamInsight);
    }

    /**
     * Asserts that the actual team insight matches the expected team insight.
     * 
     * @param actualTeamInsight The actual team insight to assert.
     * @param expectedTeamInsight The expected team insight to assert.
     */
    assertTeamInsightEquals(actualTeamInsight: ITeamInsight, expectedTeamInsight: ITeamInsight): void {
        assert.strictEqual(actualTeamInsight.code, expectedTeamInsight.code);
        assert.strictEqual(actualTeamInsight.fullName, expectedTeamInsight.fullName);
        if (expectedTeamInsight.pointsAllowedPerPosition) {
            assert.strictEqual(actualTeamInsight.pointsAllowedPerPosition.length, expectedTeamInsight.pointsAllowedPerPosition.length);
            for (let i = 0; i < actualTeamInsight.pointsAllowedPerPosition.length; i++) {
                const actualPositionPoints = actualTeamInsight.pointsAllowedPerPosition[i];
                const expectedPositionPoints = expectedTeamInsight.pointsAllowedPerPosition[i];
                assert.strictEqual(actualPositionPoints.position, expectedPositionPoints.position);
                assert.strictEqual(actualPositionPoints.points, expectedPositionPoints.points);
            }
        } else {
            assert.strictEqual(actualTeamInsight.pointsAllowedPerPosition, undefined);
        }
    }
}

export default new SpecUtils();
