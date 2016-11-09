/// <reference path="../../typings/index.d.ts" />

import * as fs from "fs";
import DFSR from "../../src/retrievers/dfsr";
import * as testUtils from "../testUtils";

describe("DFSR", () => {
	describe("#parsePlayers()", () => {
		it("should parse the projection stats for an MLB DraftKings contest", () => {
			// Arrange
			const target = new DFSR();
			const data = fs.readFileSync("test/content/dfsrMLBDraftKings.csv", "utf-8");

			// Act
			const players = target.parsePlayers(data, DFSR.mlbIndices);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Josh Donaldson", team: "TOR", stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 9.811496235 }] });
			testUtils.assertContainsPlayer(players, { name: "David Ortiz", team: "BOS", stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 10.37103443 }] });
		});

		it("should parse the projection stats for an MLB FanDuel contest", () => {
			// Arrange
			const target = new DFSR();
			const data = fs.readFileSync("test/content/dfsrMLBFanDuel.csv", "utf-8");

			// Act
			const players = target.parsePlayers(data, DFSR.mlbIndices);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Josh Donaldson", team: "TOR", stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 12.91184611 }] });
			testUtils.assertContainsPlayer(players, { name: "David Ortiz", team: "BOS", stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 13.78429798 }] });
		});

		it("should parse the projection stats for an NFL DraftKings contest", () => {
			// Arrange
			const target = new DFSR();
			const data = fs.readFileSync("test/content/dfsrNFLDraftKings.csv", "utf-8");

			// Act
			const players = target.parsePlayers(data, DFSR.nflIndices);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Julio Jones", team: "ATL", stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 20.82037324 }] });
			testUtils.assertContainsPlayer(players, { name: "Aaron Rodgers", team: "GB", stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 22.44357271 }] });
		});

		it("should parse the projection stats for an NFL FanDuel contest", () => {
			// Arrange
			const target = new DFSR();
			const data = fs.readFileSync("test/content/dfsrNFLFanDuel.csv", "utf-8");

			// Act
			const players = target.parsePlayers(data, DFSR.nflIndices);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Julio Jones", team: "ATL", stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 17.25377929 }] });
			testUtils.assertContainsPlayer(players, { name: "Aaron Rodgers", team: "GB", stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 21.84755108 }] });
		});
	});
});
