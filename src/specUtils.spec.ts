import { IContest, IGame, IPlayer, IPlayerCard, ITeam } from "./interfaces";
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
		assert.equal(matchingPlayers.length, 1, `No players match with name: ${expectedPlayer.name}`);
		const actualPlayer = matchingPlayers[0];
		specUtils.assertPlayerEquals(actualPlayer, expectedPlayer);
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
		assert.equal(matchingContests.length, 1, `No contests match with ID: ${expectedContest.ID}`);
		const actualContest = matchingContests[0];
		specUtils.assertContestEquals(actualContest, expectedContest);
	}

	/**
	 * Asserts that the actual contest matches the expected contest.
	 * 
	 * @param actualContest The actual contest to assert.
	 * @param expectedContest The expected contest to assert.
	 */
	assertContestEquals(actualContest: IContest, expectedContest: IContest): void {
		assert.equal(actualContest.contestType, expectedContest.contestType);
		assert.equal(actualContest.label, expectedContest.label);
		assert.equal(actualContest.maxPlayersPerTeam, expectedContest.maxPlayersPerTeam);
		assert.equal(actualContest.maxSalary, expectedContest.maxSalary);
		assert.equal(actualContest.sport, expectedContest.sport);
		assert.deepStrictEqual(actualContest.startTime, expectedContest.startTime);
		if (expectedContest.positions) {
			assert.equal(actualContest.positions.length, expectedContest.positions.length);
			for (let i = 0; i < actualContest.positions.length; i++) {
				assert.equal(actualContest.positions[i], expectedContest.positions[i]);
			}
		} else {
			assert.equal(actualContest.positions, undefined);
		}
		if (expectedContest.games) {
			assert.equal(actualContest.games.length, expectedContest.games.length);
			for (let i = 0; i < actualContest.games.length; i++) {
				specUtils.assertGameEquals(actualContest.games[i], expectedContest.games[i]);
			}
		} else {
			assert.equal(actualContest.games, undefined);
		}
	}

	/**
	 * Asserts that the actual game matches the expected game.
	 * 
	 * @param actualGame The actual game to assert.
	 * @param expectedGame The expected game to assert.
	 */
	assertGameEquals(actualGame: IGame, expectedGame: IGame): void {
		specUtils.assertTeamEquals(actualGame.awayTeam, expectedGame.awayTeam);
		specUtils.assertTeamEquals(actualGame.homeTeam, expectedGame.homeTeam);
		assert.deepStrictEqual(actualGame.startTime, expectedGame.startTime);
	}

	/**
	 * Asserts that the actual team matches the expected team.
	 * 
	 * @param actualTeam The actual team to assert.
	 * @param expectedTeam The expected team to assert.
	 */
	assertTeamEquals(actualTeam: ITeam, expectedTeam: ITeam): void {
		assert.equal(actualTeam.code, expectedTeam.code);
		assert.equal(actualTeam.fullName, expectedTeam.fullName);
		if (expectedTeam.players) {
			assert.equal(actualTeam.players.length, expectedTeam.players.length);
			for (let i = 0; i < actualTeam.players.length; i++) {
				specUtils.assertPlayerEquals(actualTeam.players[i], expectedTeam.players[i]);
			}
		} else {
			assert.equal(actualTeam.players, undefined);
		}
	}

	/**
	 * Asserts that the actual player matches the expected player.
	 * 
	 * @param actualPlayer The actual player to assert.
	 * @param expectedPlayer The expected player to assert.
	 */
	assertPlayerEquals(actualPlayer: IPlayer, expectedPlayer: IPlayer): void {
		assert.equal(actualPlayer.team, expectedPlayer.team);
		assert.equal(actualPlayer.salary, expectedPlayer.salary);
		assert.equal(actualPlayer.isProbablePitcher, expectedPlayer.isProbablePitcher);
		assert.equal(actualPlayer.isStarter, expectedPlayer.isStarter);
		assert.equal(actualPlayer.battingOrder, expectedPlayer.battingOrder);
		if (expectedPlayer.stats) {
			assert.equal(actualPlayer.stats.length, expectedPlayer.stats.length);
			for (let i = 0; i < actualPlayer.stats.length; i++) {
				const actualStats = actualPlayer.stats[i];
				const expectedStats = expectedPlayer.stats[i];
				assert.equal(actualStats.source, expectedStats.source);
				assert.equal(actualStats.projectedCeiling, expectedStats.projectedCeiling);
				assert.equal(actualStats.projectedFloor, expectedStats.projectedFloor);
				assert.equal(actualStats.projectedPoints, expectedStats.projectedPoints);
				assert.equal(actualStats.recentAveragePoints, expectedStats.recentAveragePoints);
				assert.equal(actualStats.seasonAveragePoints, expectedStats.seasonAveragePoints);
			}
		} else {
			assert.equal(actualPlayer.stats, undefined);
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
			assert.equal(actualPlayerCard.gameLog.length, expectedPlayerCard.gameLog.length);
			for (let i = 0; i < actualPlayerCard.gameLog.length; i++) {
				const actualGameLog = actualPlayerCard.gameLog[i];
				const expectedGameLog = expectedPlayerCard.gameLog[i];
				assert.deepStrictEqual(actualGameLog.date, expectedGameLog.date);
				assert.equal(actualGameLog.opponent, expectedGameLog.opponent);
				assert.equal(actualGameLog.points, expectedGameLog.points);
			}
		} else {
			assert.equal(actualPlayerCard.gameLog, undefined);
		}
		if (expectedPlayerCard.news) {
			assert.equal(actualPlayerCard.news.length, expectedPlayerCard.news.length);
			for (let i = 0; i < actualPlayerCard.news.length; i++) {
				const actualNews = actualPlayerCard.news[i];
				const expectedNews = expectedPlayerCard.news[i];
				assert.deepStrictEqual(actualNews.date, expectedNews.date);
				assert.equal(actualNews.details, expectedNews.details);
				assert.equal(actualNews.summary, expectedNews.summary);
			}
		} else {
			assert.equal(actualPlayerCard.news, undefined);
		}
	}
}

const specUtils: SpecUtils = new SpecUtils();
export default specUtils;
