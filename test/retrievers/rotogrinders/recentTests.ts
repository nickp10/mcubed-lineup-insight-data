import * as assert from "assert";
import * as fs from "fs";
import PlayerFactory from "../../../src/playerFactory";
import RGRecent from "../../../src/retrievers/rotogrinders/recent";
import { Sport } from "../../../src/interfaces";
import * as testUtils from "../../testUtils";

describe("RGRecent", () => {
	describe("#parsePlayers()", () => {
		it("should parse the recent stats for an NBA DraftKings contest", () => {
			// Arrange
			const target = new RGRecent();
			const data = fs.readFileSync("test/content/rgRecentNBADraftKings.html", "utf-8");
			const playerFactory = new PlayerFactory(Sport.NBA);

			// Act
			const players = target.parsePlayers(playerFactory, data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "LeBron James", team: "CLE", salary: 9900, stats: [{ source: "RotoGrinders", recentAveragePoints: 60.38 }] });
			testUtils.assertContainsPlayer(players, { name: "Danilo Gallinari", team: "DEN", salary: 5800, stats: [{ source: "RotoGrinders", recentAveragePoints: 27.25 }] });
			testUtils.assertContainsPlayer(players, { name: "DeMarcus Cousins", team: "SAC", salary: 10400, stats: [{ source: "RotoGrinders", recentAveragePoints: 44.42 }] });
		});

		it("should parse the recent stats for an NBA FanDuel contest", () => {
			// Arrange
			const target = new RGRecent();
			const data = fs.readFileSync("test/content/rgRecentNBAFanDuel.html", "utf-8");
			const playerFactory = new PlayerFactory(Sport.NBA);

			// Act
			const players = target.parsePlayers(playerFactory, data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "LeBron James", team: "CLE", salary: 9900, stats: [{ source: "RotoGrinders", recentAveragePoints: 55.5 }] });
			testUtils.assertContainsPlayer(players, { name: "Danilo Gallinari", team: "DEN", salary: 6100, stats: [{ source: "RotoGrinders", recentAveragePoints: 24.9 }] });
			testUtils.assertContainsPlayer(players, { name: "DeMarcus Cousins", team: "SAC", salary: 9500, stats: [{ source: "RotoGrinders", recentAveragePoints: 42.67 }] });
		});

		it("should parse the recent stats for an NBA Yahoo contest", () => {
			// Arrange
			const target = new RGRecent();
			const data = fs.readFileSync("test/content/rgRecentNBAYahoo.html", "utf-8");
			const playerFactory = new PlayerFactory(Sport.NBA);

			// Act
			const players = target.parsePlayers(playerFactory, data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "LeBron James", team: "CLE", salary: 53, stats: [{ source: "RotoGrinders", recentAveragePoints: 56 }] });
			testUtils.assertContainsPlayer(players, { name: "Danilo Gallinari", team: "DEN", salary: 28, stats: [{ source: "RotoGrinders", recentAveragePoints: 26.23 }] });
			testUtils.assertContainsPlayer(players, { name: "DeMarcus Cousins", team: "SAC", salary: 52, stats: [{ source: "RotoGrinders", recentAveragePoints: 42.83 }] });
		});
	});
});
