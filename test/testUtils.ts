/// <reference path="../typings/index.d.ts" />

import { IPlayer } from "../src/interfaces";
import * as assert from "assert";

class TestUtils {
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
		assert.equal(actualPlayer.team, expectedPlayer.team);
		assert.equal(actualPlayer.salary, expectedPlayer.salary);
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
}

const testUtils: TestUtils = new TestUtils();
export = testUtils;
