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

		it("should parse the projection stats for an NFL DraftKings contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireNFLDraftKings.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Aaron Rodgers", team: "GB", stats: [ { source: "NumberFire", projectedPoints: 22.4 }] });
			testUtils.assertContainsPlayer(players, { name: "Melvin Gordon", team: "SD", stats: [ { source: "NumberFire", projectedPoints: 18.4 }] });
		});

		it("should parse the projection stats for an NFL FanDuel contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireNFLFanDuel.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Aaron Rodgers", team: "GB", stats: [ { source: "NumberFire", projectedPoints: 22.3 }] });
			testUtils.assertContainsPlayer(players, { name: "Melvin Gordon", team: "SD", stats: [ { source: "NumberFire", projectedPoints: 16.2 }] });
		});

		it("should parse the projection stats for an NFL Yahoo contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireNFLYahoo.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Aaron Rodgers", team: "GB", stats: [ { source: "NumberFire", projectedPoints: 22.3 }] });
			testUtils.assertContainsPlayer(players, { name: "Melvin Gordon", team: "SD", stats: [ { source: "NumberFire", projectedPoints: 16.2 }] });
		});
	});
});
