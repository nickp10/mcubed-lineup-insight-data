/// <reference path="../../../typings/index.d.ts" />

import * as assert from "assert";
import * as fs from "fs";
import RGRecent from "../../../src/retrievers/rotogrinders/recent";
import * as testUtils from "../../testUtils";

describe("RGRecent", () => {
	describe("#parsePlayers()", () => {
		it("should parse the recent stats for an NBA DraftKings contest", () => {
			// Arrange
			const target = new RGRecent();
			const data = fs.readFileSync("test/content/rgRecentNBADraftKings.html", "utf-8");

			// Act
			const players = target.parsePlayers(data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "LeBron James", team: "CLE", stats: [{ source: "RotoGrinders", recentAveragePoints: 60.38 }] });
			testUtils.assertContainsPlayer(players, { name: "Danilo Gallinari", team: "DEN", stats: [{ source: "RotoGrinders", recentAveragePoints: 27.25 }] });
			testUtils.assertContainsPlayer(players, { name: "DeMarcus Cousins", team: "SAC", stats: [{ source: "RotoGrinders", recentAveragePoints: 44.42 }] });
		});

		it("should parse the recent stats for an NBA FanDuel contest", () => {
			// Arrange
			const target = new RGRecent();
			const data = fs.readFileSync("test/content/rgRecentNBAFanDuel.html", "utf-8");

			// Act
			const players = target.parsePlayers(data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "LeBron James", team: "CLE", stats: [{ source: "RotoGrinders", recentAveragePoints: 55.5 }] });
			testUtils.assertContainsPlayer(players, { name: "Danilo Gallinari", team: "DEN", stats: [{ source: "RotoGrinders", recentAveragePoints: 24.9 }] });
			testUtils.assertContainsPlayer(players, { name: "DeMarcus Cousins", team: "SAC", stats: [{ source: "RotoGrinders", recentAveragePoints: 42.67 }] });
		});

		it("should parse the recent stats for an NBA Yahoo contest", () => {
			// Arrange
			const target = new RGRecent();
			const data = fs.readFileSync("test/content/rgRecentNBAYahoo.html", "utf-8");

			// Act
			const players = target.parsePlayers(data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "LeBron James", team: "CLE", stats: [{ source: "RotoGrinders", recentAveragePoints: 56 }] });
			testUtils.assertContainsPlayer(players, { name: "Danilo Gallinari", team: "DEN", stats: [{ source: "RotoGrinders", recentAveragePoints: 26.23 }] });
			testUtils.assertContainsPlayer(players, { name: "DeMarcus Cousins", team: "SAC", stats: [{ source: "RotoGrinders", recentAveragePoints: 42.83 }] });
		});
	});
});
