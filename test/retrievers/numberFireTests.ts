/// <reference path="../../typings/index.d.ts" />

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
			testUtils.assertContainsPlayer(players, { name: "Anthony Rizzo", team: "CHC", stats: [ { source: "NumberFire", projectedPoints: 8.7 }] });
			testUtils.assertContainsPlayer(players, { name: "Jason Kipnis", team: "CLE", stats: [ { source: "NumberFire", projectedPoints: 8.3 }] });
		});

		it("should parse the projection stats for an MLB FanDuel contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireMLBFanDuel.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Anthony Rizzo", team: "CHC", stats: [ { source: "NumberFire", projectedPoints: 11.4 }] });
			testUtils.assertContainsPlayer(players, { name: "Jason Kipnis", team: "CLE", stats: [ { source: "NumberFire", projectedPoints: 10.8 }] });
		});

		it("should parse the projection stats for an MLB Yahoo contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireMLBYahoo.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Anthony Rizzo", team: "CHC", stats: [ { source: "NumberFire", projectedPoints: 7.2 }] });
			testUtils.assertContainsPlayer(players, { name: "Jason Kipnis", team: "CLE", stats: [ { source: "NumberFire", projectedPoints: 6.9 }] });
		});

		it("should parse the projection stats for an NBA DraftKings contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireNBADraftKings.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Russell Westbrook", team: "OKC", stats: [ { source: "NumberFire", projectedPoints: 60.3 }] });
			testUtils.assertContainsPlayer(players, { name: "James Harden", team: "HOU", stats: [ { source: "NumberFire", projectedPoints: 56.6 }] });
		});

		it("should parse the projection stats for an NBA FanDuel contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireNBAFanDuel.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Russell Westbrook", team: "OKC", stats: [ { source: "NumberFire", projectedPoints: 55.3 }] });
			testUtils.assertContainsPlayer(players, { name: "James Harden", team: "HOU", stats: [ { source: "NumberFire", projectedPoints: 52.4 }] });
		});

		it("should parse the projection stats for an NBA Yahoo contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireNBAYahoo.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Russell Westbrook", team: "OKC", stats: [ { source: "NumberFire", projectedPoints: 56.0 }] });
			testUtils.assertContainsPlayer(players, { name: "James Harden", team: "HOU", stats: [ { source: "NumberFire", projectedPoints: 54.0 }] });
		});

		it("should parse the projection stats for an NFL DraftKings contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireNFLDraftKings.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Aaron Rodgers", team: "GB", stats: [ { source: "NumberFire", projectedPoints: 22.2 }] });
			testUtils.assertContainsPlayer(players, { name: "Melvin Gordon", team: "SD", stats: [ { source: "NumberFire", projectedPoints: 17.4 }] });
		});

		it("should parse the projection stats for an NFL FanDuel contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireNFLFanDuel.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Aaron Rodgers", team: "GB", stats: [ { source: "NumberFire", projectedPoints: 21.9 }] });
			testUtils.assertContainsPlayer(players, { name: "Melvin Gordon", team: "SD", stats: [ { source: "NumberFire", projectedPoints: 15.2 }] });
		});

		it("should parse the projection stats for an NFL Yahoo contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireNFLYahoo.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Aaron Rodgers", team: "GB", stats: [ { source: "NumberFire", projectedPoints: 21.9 }] });
			testUtils.assertContainsPlayer(players, { name: "Melvin Gordon", team: "SD", stats: [ { source: "NumberFire", projectedPoints: 15.2 }] });
		});
	});
});
