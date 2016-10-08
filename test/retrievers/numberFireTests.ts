/// <reference path="../../typings/index.d.ts" />

import * as assert from "assert";
import * as cheerio from "cheerio";
import * as fs from "fs";
import NumberFire from "../../src/retrievers/numberFire";
import * as testUtils from "../testUtils";

describe("NumberFire", () => {
	describe("#parsePlayers()", () => {
		it("should parse the projection stats for an MLB DraftKings contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireMLBDraftKings.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Kris Bryant", team: "CHC", stats: [ { source: "NumberFire", projectedPoints: 9.3 }] });
			testUtils.assertContainsPlayer(players, { name: "Hunter Pence", team: "SFG", stats: [ { source: "NumberFire", projectedPoints: 7.3 }] });
		});

		it("should parse the projection stats for an MLB FanDuel contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireMLBFanDuel.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Kris Bryant", team: "CHC", stats: [ { source: "NumberFire", projectedPoints: 12.3 }] });
			testUtils.assertContainsPlayer(players, { name: "Hunter Pence", team: "SFG", stats: [ { source: "NumberFire", projectedPoints: 9.5 }] });
		});

		it("should parse the projection stats for an MLB Yahoo contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireMLBYahoo.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Kris Bryant", team: "CHC", stats: [ { source: "NumberFire", projectedPoints: 7.8 }] });
			testUtils.assertContainsPlayer(players, { name: "Hunter Pence", team: "SFG", stats: [ { source: "NumberFire", projectedPoints: 6.0 }] });
		});
	});
});
