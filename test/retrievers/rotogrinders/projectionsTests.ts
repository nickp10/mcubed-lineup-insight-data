/// <reference path="../../../typings/index.d.ts" />

import * as assert from "assert";
import * as cheerio from "cheerio";
import * as fs from "fs";
import RGProjections from "../../../src/retrievers/rotogrinders/projections";
import * as testUtils from "../../testUtils";

describe("RGStarting", () => {
	describe("#parsePlayers()", () => {
		it("should parse the projections for an NBA DraftKings contest", () => {
			// Arrange
			const target = new RGProjections();
			const data = fs.readFileSync("test/content/rgProjectionsNBADraftKings.html", "UTF-8");

			// Act
			const players = target.parsePlayers(data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Blake Griffin", team: "LAC", stats: [{ source: "RotoGrinders", projectedPoints: 40.83, projectedCeiling: 52.6707, projectedFloor: 28.9893 }] });
			testUtils.assertContainsPlayer(players, { name: "Kawhi Leonard", team: "SA", stats: [{ source: "RotoGrinders", projectedPoints: 40.23, projectedCeiling: 49.0806, projectedFloor: 31.3794 }] });
			testUtils.assertContainsPlayer(players, { name: "Jimmy Butler", team: "CHI", stats: [{ source: "RotoGrinders", projectedPoints: 35.33, projectedCeiling: 45.929, projectedFloor: 24.731 }] });
		});

		it("should parse the projections for an NBA FanDuel contest", () => {
			// Arrange
			const target = new RGProjections();
			const data = fs.readFileSync("test/content/rgProjectionsNBAFanDuel.html", "UTF-8");

			// Act
			const players = target.parsePlayers(data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Blake Griffin", team: "LAC", stats: [{ source: "RotoGrinders", projectedPoints: 39.15, projectedCeiling: 50.5035, projectedFloor: 27.7965 }] });
			testUtils.assertContainsPlayer(players, { name: "Kawhi Leonard", team: "SA", stats: [{ source: "RotoGrinders", projectedPoints: 37.96, projectedCeiling: 46.3112, projectedFloor: 29.6088 }] });
			testUtils.assertContainsPlayer(players, { name: "Jimmy Butler", team: "CHI", stats: [{ source: "RotoGrinders", projectedPoints: 33.42, projectedCeiling: 43.446, projectedFloor: 23.394 }] });
		});

		it("should parse the projections for an NFL DraftKings contest", () => {
			// Arrange
			const target = new RGProjections();
			const data = fs.readFileSync("test/content/rgProjectionsNFLDraftKings.html", "UTF-8");

			// Act
			const players = target.parsePlayers(data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Tom Brady", team: "NE", stats: [{ source: "RotoGrinders", projectedPoints: 25.73, projectedCeiling: 31.3906, projectedFloor: 20.0694 }] });
			testUtils.assertContainsPlayer(players, { name: "Drew Brees", team: "NO", stats: [{ source: "RotoGrinders", projectedPoints: 20.69, projectedCeiling: 26.897, projectedFloor: 14.483 }] });
		});

		it("should parse the projections for an NFL FanDuel contest", () => {
			// Arrange
			const target = new RGProjections();
			const data = fs.readFileSync("test/content/rgProjectionsNFLFanDuel.html", "UTF-8");

			// Act
			const players = target.parsePlayers(data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Tom Brady", team: "NE", stats: [{ source: "RotoGrinders", projectedPoints: 22.31, projectedCeiling: 27.2182, projectedFloor: 17.4018 }] });
			testUtils.assertContainsPlayer(players, { name: "Drew Brees", team: "NO", stats: [{ source: "RotoGrinders", projectedPoints: 20.44, projectedCeiling: 26.572, projectedFloor: 14.308 }] });
		});
	});
});
