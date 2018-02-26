import * as fs from "fs";
import DFSR from "./dfsr";
import PlayerFactory from "../playerFactory";
import { Sport } from "../interfaces";
import specUtils from "../specUtils.spec";

describe("DFSR", () => {
	describe("#parsePlayers()", () => {
		it("should parse the projection stats for an MLB DraftKings contest", () => {
			// Arrange
			const target = new DFSR();
			const data = fs.readFileSync("spec-content/dfsrMLBDraftKings.csv", "utf-8");
			const playerFactory = new PlayerFactory(Sport.MLB);

			// Act
			const players = target.parsePlayers(playerFactory, data, 1, 10, 2, 3);

			// Assert
			specUtils.assertContainsPlayer(players, { name: "Josh Donaldson", team: "TOR", salary: 5400, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 9.811496235 }] });
			specUtils.assertContainsPlayer(players, { name: "David Ortiz", team: "BOS", salary: 5200, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 10.37103443 }] });
		});

		it("should parse the projection stats for an MLB FanDuel contest", () => {
			// Arrange
			const target = new DFSR();
			const data = fs.readFileSync("spec-content/dfsrMLBFanDuel.csv", "utf-8");
			const playerFactory = new PlayerFactory(Sport.MLB);

			// Act
			const players = target.parsePlayers(playerFactory, data, 1, 10, 2, 3);

			// Assert
			specUtils.assertContainsPlayer(players, { name: "Josh Donaldson", team: "TOR", salary: 3900, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 12.91184611 }] });
			specUtils.assertContainsPlayer(players, { name: "David Ortiz", team: "BOS", salary: 4300, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 13.78429798 }] });
		});

		it("should parse the projection stats for an NFL DraftKings contest", () => {
			// Arrange
			const target = new DFSR();
			const data = fs.readFileSync("spec-content/dfsrNFLDraftKings.csv", "utf-8");
			const playerFactory = new PlayerFactory(Sport.NFL);

			// Act
			const players = target.parsePlayers(playerFactory, data, 1, 2, 4, 6);

			// Assert
			specUtils.assertContainsPlayer(players, { name: "Julio Jones", team: "ATL", salary: 9600, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 20.82037324 }] });
			specUtils.assertContainsPlayer(players, { name: "Aaron Rodgers", team: "GB", salary: 7700, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 22.44357271 }] });
		});

		it("should parse the projection stats for an NFL FanDuel contest", () => {
			// Arrange
			const target = new DFSR();
			const data = fs.readFileSync("spec-content/dfsrNFLFanDuel.csv", "utf-8");
			const playerFactory = new PlayerFactory(Sport.NFL);

			// Act
			const players = target.parsePlayers(playerFactory, data, 1, 2, 4, 6);

			// Assert
			specUtils.assertContainsPlayer(players, { name: "Julio Jones", team: "ATL", salary: 8900, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 17.25377929 }] });
			specUtils.assertContainsPlayer(players, { name: "Aaron Rodgers", team: "GB", salary: 9100, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 21.84755108 }] });
		});
	});
});
