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
			const data =  cheerio.load(fs.readFileSync("test/content/rgStartingMLBDraftKings.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data, "mlb");

			// Assert
			assert.equal(players.length, 2);
			testUtils.assertContainsPlayer(players, { name: "Clayton Kershaw", team: "LAD", isStarter: true, battingOrder: "NA" });
			testUtils.assertContainsPlayer(players, { name: "Jon Lester", team: "CHC", isStarter: true, battingOrder: "NA" });
			//testUtils.assertContainsPlayer(players, { name: "Chase Utley", team: "LAD", isStarter: true, battingOrder: "1st" });
			//testUtils.assertContainsPlayer(players, { name: "Anthony Rizzo", team: "CHC", isStarter: true, battingOrder: "3rd" });
		});

		it("should parse the starting player information for an MLB FanDuel contest", () => {
			// Arrange
			const target = new RGStarting();
			const data =  cheerio.load(fs.readFileSync("test/content/rgStartingMLBFanDuel.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data, "mlb");

			// Assert
			assert.equal(players.length, 2);
			testUtils.assertContainsPlayer(players, { name: "Clayton Kershaw", team: "LAD", isStarter: true, battingOrder: "NA" });
			testUtils.assertContainsPlayer(players, { name: "Jon Lester", team: "CHC", isStarter: true, battingOrder: "NA" });
			//testUtils.assertContainsPlayer(players, { name: "Chase Utley", team: "LAD", isStarter: true, battingOrder: "1st" });
			//testUtils.assertContainsPlayer(players, { name: "Anthony Rizzo", team: "CHC", isStarter: true, battingOrder: "3rd" });
		});

		it("should parse the starting player information for an MLB Yahoo contest", () => {
			// Arrange
			const target = new RGStarting();
			const data =  cheerio.load(fs.readFileSync("test/content/rgStartingMLBYahoo.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data, "mlb");

			// Assert
			assert.equal(players.length, 2);
			testUtils.assertContainsPlayer(players, { name: "Clayton Kershaw", team: "LAD", isStarter: true, battingOrder: "NA" });
			testUtils.assertContainsPlayer(players, { name: "Jon Lester", team: "CHC", isStarter: true, battingOrder: "NA" });
			//testUtils.assertContainsPlayer(players, { name: "Chase Utley", team: "LAD", isStarter: true, battingOrder: "1st" });
			//testUtils.assertContainsPlayer(players, { name: "Anthony Rizzo", team: "CHC", isStarter: true, battingOrder: "3rd" });
		});

		it("should parse the starting player information for an NBA DraftKings contest", () => {
			// Arrange
			const target = new RGStarting();
			const data =  cheerio.load(fs.readFileSync("test/content/rgStartingNBADraftKings.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data, "nba");

			// Assert
			assert.equal(players.length, 30);
			testUtils.assertContainsPlayer(players, { name: "Carmelo Anthony", team: "NYK", isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "LeBron James", team: "CLE", isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "Stephen Curry", team: "GS", isStarter: true });
		});

		it("should parse the starting player information for an NBA FanDuel contest", () => {
			// Arrange
			const target = new RGStarting();
			const data =  cheerio.load(fs.readFileSync("test/content/rgStartingNBAFanDuel.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data, "nba");

			// Assert
			assert.equal(players.length, 30);
			testUtils.assertContainsPlayer(players, { name: "Carmelo Anthony", team: "NYK", isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "LeBron James", team: "CLE", isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "Stephen Curry", team: "GS", isStarter: true });
		});

		it("should parse the starting player information for an NBA Yahoo contest", () => {
			// Arrange
			const target = new RGStarting();
			const data =  cheerio.load(fs.readFileSync("test/content/rgStartingNBAYahoo.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data, "nba");

			// Assert
			assert.equal(players.length, 29);
			testUtils.assertContainsPlayer(players, { name: "Carmelo Anthony", team: "NYK", isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "LeBron James", team: "CLE", isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "Stephen Curry", team: "GS", isStarter: true });
		});

		it("should parse the starting player information for an NFL DraftKings contest", () => {
			// Arrange
			const target = new RGStarting();
			const data =  cheerio.load(fs.readFileSync("test/content/rgStartingNFLDraftKings.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data, "nfl");

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Russell Wilson", team: "SEA", isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "David Johnson", team: "ARI", isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "Virgil Green", team: "DEN", isStarter: true });
		});

		it("should parse the starting player information for an NFL FanDuel contest", () => {
			// Arrange
			const target = new RGStarting();
			const data =  cheerio.load(fs.readFileSync("test/content/rgStartingNFLFanDuel.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data, "nfl");

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Russell Wilson", team: "SEA", isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "David Johnson", team: "ARI", isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "Brandon McManus", team: "DEN", isStarter: true });
		});

		it("should parse the starting player information for an NFL Yahoo contest", () => {
			// Arrange
			const target = new RGStarting();
			const data =  cheerio.load(fs.readFileSync("test/content/rgStartingNFLYahoo.html", "UTF-8"));

			// Act
			const players = target.parsePlayers(data, "nfl");

			// Assert
			testUtils.assertContainsPlayer(players, { name: "Russell Wilson", team: "SEA", isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "David Johnson", team: "ARI", isStarter: true });
			testUtils.assertContainsPlayer(players, { name: "Virgil Green", team: "DEN", isStarter: true });
		});
	});
});
