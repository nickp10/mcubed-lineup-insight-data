/// <reference path="../../typings/index.d.ts" />

import * as cheerio from "cheerio";
import * as fs from "fs";
import NumberFire from "../../src/retrievers/numberFire";
import PlayerFactory from "../../src/playerFactory";
import * as testUtils from "../testUtils";

describe("NumberFire", () => {
	describe("#parsePlayers()", () => {
		it("should parse the projection stats for an MLB DraftKings contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireMLBDraftKings.html", "utf-8"));
			const playerFactory = new PlayerFactory("mlb");

			// Act
			const players = target.parsePlayers(playerFactory, data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Anthony Rizzo", team: "CHC", salary: 0, stats: [ { source: "NumberFire", projectedPoints: 8.7 }] });
			testUtils.assertContainsPlayer(players, { name: "Jason Kipnis", team: "CLE", salary: 0, stats: [ { source: "NumberFire", projectedPoints: 8.3 }] });
		});

		it("should parse the projection stats for an MLB FanDuel contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireMLBFanDuel.html", "utf-8"));
			const playerFactory = new PlayerFactory("mlb");

			// Act
			const players = target.parsePlayers(playerFactory, data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Anthony Rizzo", team: "CHC", salary: 0, stats: [ { source: "NumberFire", projectedPoints: 11.4 }] });
			testUtils.assertContainsPlayer(players, { name: "Jason Kipnis", team: "CLE", salary: 0, stats: [ { source: "NumberFire", projectedPoints: 10.8 }] });
		});

		it("should parse the projection stats for an MLB Yahoo contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireMLBYahoo.html", "utf-8"));
			const playerFactory = new PlayerFactory("mlb");

			// Act
			const players = target.parsePlayers(playerFactory, data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Anthony Rizzo", team: "CHC", salary: 0, stats: [ { source: "NumberFire", projectedPoints: 7.2 }] });
			testUtils.assertContainsPlayer(players, { name: "Jason Kipnis", team: "CLE", salary: 0, stats: [ { source: "NumberFire", projectedPoints: 6.9 }] });
		});

		it("should parse the projection stats for an NBA DraftKings contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireNBADraftKings.html", "utf-8"));
			const playerFactory = new PlayerFactory("nba");

			// Act
			const players = target.parsePlayers(playerFactory, data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Russell Westbrook", team: "OKC", salary: 12100, stats: [ { source: "NumberFire", projectedPoints: 59.6 }] });
			testUtils.assertContainsPlayer(players, { name: "Kevin Durant", team: "GS", salary: 9700, stats: [ { source: "NumberFire", projectedPoints: 49.5 }] });
		});

		it("should parse the projection stats for an NBA FanDuel contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireNBAFanDuel.html", "utf-8"));
			const playerFactory = new PlayerFactory("nba");

			// Act
			const players = target.parsePlayers(playerFactory, data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Russell Westbrook", team: "OKC", salary: 12000, stats: [ { source: "NumberFire", projectedPoints: 54.1 }] });
			testUtils.assertContainsPlayer(players, { name: "Kevin Durant", team: "GS", salary: 10400, stats: [ { source: "NumberFire", projectedPoints: 46.8 }] });
		});

		it("should parse the projection stats for an NBA Yahoo contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireNBAYahoo.html", "utf-8"));
			const playerFactory = new PlayerFactory("nba");

			// Act
			const players = target.parsePlayers(playerFactory, data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Russell Westbrook", team: "OKC", salary: 63, stats: [ { source: "NumberFire", projectedPoints: 55.1 }] });
			testUtils.assertContainsPlayer(players, { name: "Kevin Durant", team: "GS", salary: 52, stats: [ { source: "NumberFire", projectedPoints: 47.7 }] });
		});

		it("should parse the projection stats for an NFL DraftKings contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireNFLDraftKings.html", "utf-8"));
			const playerFactory = new PlayerFactory("nfl");

			// Act
			const players = target.parsePlayers(playerFactory, data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Aaron Rodgers", team: "GB", salary: 7500, stats: [ { source: "NumberFire", projectedPoints: 22.2 }] });
			testUtils.assertContainsPlayer(players, { name: "Melvin Gordon", team: "SD", salary: 5700, stats: [ { source: "NumberFire", projectedPoints: 17.4 }] });
		});

		it("should parse the projection stats for an NFL FanDuel contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireNFLFanDuel.html", "utf-8"));
			const playerFactory = new PlayerFactory("nfl");

			// Act
			const players = target.parsePlayers(playerFactory, data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Aaron Rodgers", team: "GB", salary: 8800, stats: [ { source: "NumberFire", projectedPoints: 21.9 }] });
			testUtils.assertContainsPlayer(players, { name: "Melvin Gordon", team: "SD", salary: 7200, stats: [ { source: "NumberFire", projectedPoints: 15.2 }] });
		});

		it("should parse the projection stats for an NFL Yahoo contest", () => {
			// Arrange
			const target = new NumberFire();
			const data = cheerio.load(fs.readFileSync("test/content/numberFireNFLYahoo.html", "utf-8"));
			const playerFactory = new PlayerFactory("nfl");

			// Act
			const players = target.parsePlayers(playerFactory, data);

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Aaron Rodgers", team: "GB", salary: 37, stats: [ { source: "NumberFire", projectedPoints: 21.9 }] });
			testUtils.assertContainsPlayer(players, { name: "Melvin Gordon", team: "SD", salary: 30, stats: [ { source: "NumberFire", projectedPoints: 15.2 }] });
		});
	});
});
