/// <reference path="../../../typings/index.d.ts" />

import * as assert from "assert";
import * as cheerio from "cheerio";
import * as fs from "fs";
import RGStarting from "../../../src/retrievers/rotogrinders/starting";
import * as testUtils from "../../testUtils";

describe("RGStarting", () => {
	describe("#parsePlayers()", () => {
		it("should parse the starting player information for an MLB DraftKings contest", () => {
			// Arrange
			const target = new RGStarting();
			const data =  cheerio.load(fs.readFileSync("test/content/rgStartingMLBDraftKings.html", "utf-8"));

			// Act
			const players = target.parsePlayers(data, "mlb");

			// Assert
			assert.equal(players.length, 2);
			testUtils.assertContainsPlayer(players, { name: "Clayton Kershaw", team: "LAD", salary: -1, isStarter: true, battingOrder: "NA" });
			testUtils.assertContainsPlayer(players, { name: "Jon Lester", team: "CHC", salary: -1, isStarter: true, battingOrder: "NA" });
			//testUtils.assertContainsPlayer(players, { name: "Chase Utley", team: "LAD", salary: 0, isStarter: true, battingOrder: "1st" });
			//testUtils.assertContainsPlayer(players, { name: "Anthony Rizzo", team: "CHC", salary: 0, isStarter: true, battingOrder: "3rd" });
		});

		it("should parse the starting player information for an MLB FanDuel contest", () => {
			// Arrange
			const target = new RGStarting();
			const data =  cheerio.load(fs.readFileSync("test/content/rgStartingMLBFanDuel.html", "utf-8"));

			// Act
			const players = target.parsePlayers(data, "mlb");

			// Assert
			assert.equal(players.length, 2);
			testUtils.assertContainsPlayer(players, { name: "Clayton Kershaw", team: "LAD", salary: -1, isStarter: true, battingOrder: "NA" });
			testUtils.assertContainsPlayer(players, { name: "Jon Lester", team: "CHC", salary: -1, isStarter: true, battingOrder: "NA" });
			//testUtils.assertContainsPlayer(players, { name: "Chase Utley", team: "LAD", salary: 0, isStarter: true, battingOrder: "1st" });
			//testUtils.assertContainsPlayer(players, { name: "Anthony Rizzo", team: "CHC", salary: 0, isStarter: true, battingOrder: "3rd" });
		});

		it("should parse the starting player information for an MLB Yahoo contest", () => {
			// Arrange
			const target = new RGStarting();
			const data =  cheerio.load(fs.readFileSync("test/content/rgStartingMLBYahoo.html", "utf-8"));

			// Act
			const players = target.parsePlayers(data, "mlb");

			// Assert
			assert.equal(players.length, 2);
			testUtils.assertContainsPlayer(players, { name: "Clayton Kershaw", team: "LAD", salary: -1, isStarter: true, battingOrder: "NA" });
			testUtils.assertContainsPlayer(players, { name: "Jon Lester", team: "CHC", salary: -1, isStarter: true, battingOrder: "NA" });
			//testUtils.assertContainsPlayer(players, { name: "Chase Utley", team: "LAD", salary: 0, isStarter: true, battingOrder: "1st" });
			//testUtils.assertContainsPlayer(players, { name: "Anthony Rizzo", team: "CHC", salary: 0, isStarter: true, battingOrder: "3rd" });
		});

		it("should parse the starting player information for an NBA DraftKings contest", () => {
			// Arrange
			const target = new RGStarting();
			const data =  cheerio.load(fs.readFileSync("test/content/rgStartingNBADraftKings.html", "utf-8"));

			// Act
			const players = target.parsePlayers(data, "nba");

			// Assert
			assert.equal(players.length, 30);
			testUtils.assertContainsPlayer(players, { name: "Carmelo Anthony", team: "NY", salary: 7600, isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "LeBron James", team: "CLE", salary: 9000, isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "Stephen Curry", team: "GS", salary: 9600, isStarter: true });
		});

		it("should parse the starting player information for an NBA FanDuel contest", () => {
			// Arrange
			const target = new RGStarting();
			const data =  cheerio.load(fs.readFileSync("test/content/rgStartingNBAFanDuel.html", "utf-8"));

			// Act
			const players = target.parsePlayers(data, "nba");

			// Assert
			assert.equal(players.length, 30);
			testUtils.assertContainsPlayer(players, { name: "Carmelo Anthony", team: "NY", salary: 8000, isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "LeBron James", team: "CLE", salary: 9600, isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "Stephen Curry", team: "GS", salary: 9300, isStarter: true });
		});

		it("should parse the starting player information for an NBA Yahoo contest", () => {
			// Arrange
			const target = new RGStarting();
			const data =  cheerio.load(fs.readFileSync("test/content/rgStartingNBAYahoo.html", "utf-8"));

			// Act
			const players = target.parsePlayers(data, "nba");

			// Assert
			assert.equal(players.length, 29);
			testUtils.assertContainsPlayer(players, { name: "Carmelo Anthony", team: "NY", salary: 41, isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "LeBron James", team: "CLE", salary: 52, isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "Stephen Curry", team: "GS", salary: 53, isStarter: true });
		});

		it("should parse the starting player information for an NFL DraftKings contest", () => {
			// Arrange
			const target = new RGStarting();
			const data =  cheerio.load(fs.readFileSync("test/content/rgStartingNFLDraftKings.html", "utf-8"));

			// Act
			const players = target.parsePlayers(data, "nfl");

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Russell Wilson", team: "SEA", salary: 6700, isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "David Johnson", team: "ARI", salary: 7400, isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "Virgil Green", team: "DEN", salary: 2700, isStarter: true });
		});

		it("should parse the starting player information for an NFL FanDuel contest", () => {
			// Arrange
			const target = new RGStarting();
			const data =  cheerio.load(fs.readFileSync("test/content/rgStartingNFLFanDuel.html", "utf-8"));

			// Act
			const players = target.parsePlayers(data, "nfl");

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Russell Wilson", team: "SEA", salary: 8000, isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "David Johnson", team: "ARI", salary: 8500, isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "Brandon McManus", team: "DEN", salary: 4700, isStarter: true });
		});

		it("should parse the starting player information for an NFL Yahoo contest", () => {
			// Arrange
			const target = new RGStarting();
			const data =  cheerio.load(fs.readFileSync("test/content/rgStartingNFLYahoo.html", "utf-8"));

			// Act
			const players = target.parsePlayers(data, "nfl");

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Russell Wilson", team: "SEA", salary: 34, isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "David Johnson", team: "ARI", salary: 39, isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "Virgil Green", team: "DEN", salary: 10, isStarter: true });
		});
	});
});
