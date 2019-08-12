import * as assert from "assert";
import * as fs from "fs";
import PlayerFactory from "../../playerFactory";
import RGStarting from "./starting";
import { Sport } from "../../interfaces";
import specUtils from "../../specUtils.spec";

describe("RGStarting", () => {
    describe("#parsePlayers()", () => {
        it("should parse the starting player information for an MLB DraftKings contest", () => {
            // Arrange
            const target = new RGStarting();
            const data = fs.readFileSync("spec-content/rgStartingMLBDraftKings.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.MLB);

            // Act
            const players = target.parsePlayers(playerFactory, data, "mlb");

            // Assert
            assert.strictEqual(players.length, 2);
            specUtils.assertContainsPlayer(players, { name: "Clayton Kershaw", team: "LOS", salary: -1, isStarter: true, battingOrder: "NA" });
            specUtils.assertContainsPlayer(players, { name: "Jon Lester", team: "CHC", salary: -1, isStarter: true, battingOrder: "NA" });
            //specUtils.assertContainsPlayer(players, { name: "Chase Utley", team: "LOS", salary: 0, isStarter: true, battingOrder: "1st" });
            //specUtils.assertContainsPlayer(players, { name: "Anthony Rizzo", team: "CHC", salary: 0, isStarter: true, battingOrder: "3rd" });
        });

        it("should parse the starting player information for an MLB FanDuel contest", () => {
            // Arrange
            const target = new RGStarting();
            const data = fs.readFileSync("spec-content/rgStartingMLBFanDuel.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.MLB);

            // Act
            const players = target.parsePlayers(playerFactory, data, "mlb");

            // Assert
            assert.strictEqual(players.length, 2);
            specUtils.assertContainsPlayer(players, { name: "Clayton Kershaw", team: "LOS", salary: -1, isStarter: true, battingOrder: "NA" });
            specUtils.assertContainsPlayer(players, { name: "Jon Lester", team: "CHC", salary: -1, isStarter: true, battingOrder: "NA" });
            //specUtils.assertContainsPlayer(players, { name: "Chase Utley", team: "LOS", salary: 0, isStarter: true, battingOrder: "1st" });
            //specUtils.assertContainsPlayer(players, { name: "Anthony Rizzo", team: "CHC", salary: 0, isStarter: true, battingOrder: "3rd" });
        });

        it("should parse the starting player information for an MLB Yahoo contest", () => {
            // Arrange
            const target = new RGStarting();
            const data = fs.readFileSync("spec-content/rgStartingMLBYahoo.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.MLB);

            // Act
            const players = target.parsePlayers(playerFactory, data, "mlb");

            // Assert
            assert.strictEqual(players.length, 2);
            specUtils.assertContainsPlayer(players, { name: "Clayton Kershaw", team: "LOS", salary: -1, isStarter: true, battingOrder: "NA" });
            specUtils.assertContainsPlayer(players, { name: "Jon Lester", team: "CHC", salary: -1, isStarter: true, battingOrder: "NA" });
            //specUtils.assertContainsPlayer(players, { name: "Chase Utley", team: "LOS", salary: 0, isStarter: true, battingOrder: "1st" });
            //specUtils.assertContainsPlayer(players, { name: "Anthony Rizzo", team: "CHC", salary: 0, isStarter: true, battingOrder: "3rd" });
        });

        it("should parse the starting player information for an NBA DraftKings contest", () => {
            // Arrange
            const target = new RGStarting();
            const data = fs.readFileSync("spec-content/rgStartingNBADraftKings.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NBA);

            // Act
            const players = target.parsePlayers(playerFactory, data, "nba");

            // Assert
            assert.strictEqual(players.length, 30);
            specUtils.assertContainsPlayer(players, { name: "Carmelo Anthony", team: "NY", salary: 7600, isStarter: true });
            specUtils.assertContainsPlayer(players, { name: "LeBron James", team: "CLE", salary: 9000, isStarter: true });
            specUtils.assertContainsPlayer(players, { name: "Stephen Curry", team: "GS", salary: 9600, isStarter: true });
        });

        it("should parse the starting player information for an NBA FanDuel contest", () => {
            // Arrange
            const target = new RGStarting();
            const data = fs.readFileSync("spec-content/rgStartingNBAFanDuel.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NBA);

            // Act
            const players = target.parsePlayers(playerFactory, data, "nba");

            // Assert
            assert.strictEqual(players.length, 30);
            specUtils.assertContainsPlayer(players, { name: "Carmelo Anthony", team: "NY", salary: 8000, isStarter: true });
            specUtils.assertContainsPlayer(players, { name: "LeBron James", team: "CLE", salary: 9600, isStarter: true });
            specUtils.assertContainsPlayer(players, { name: "Stephen Curry", team: "GS", salary: 9300, isStarter: true });
        });

        it("should parse the starting player information for an NBA Yahoo contest", () => {
            // Arrange
            const target = new RGStarting();
            const data = fs.readFileSync("spec-content/rgStartingNBAYahoo.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NBA);

            // Act
            const players = target.parsePlayers(playerFactory, data, "nba");

            // Assert
            assert.strictEqual(players.length, 29);
            specUtils.assertContainsPlayer(players, { name: "Carmelo Anthony", team: "NY", salary: 41, isStarter: true });
            specUtils.assertContainsPlayer(players, { name: "LeBron James", team: "CLE", salary: 52, isStarter: true });
            specUtils.assertContainsPlayer(players, { name: "Stephen Curry", team: "GS", salary: 53, isStarter: true });
        });

        it("should parse the starting player information for an NFL DraftKings contest", () => {
            // Arrange
            const target = new RGStarting();
            const data = fs.readFileSync("spec-content/rgStartingNFLDraftKings.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NFL);

            // Act
            const players = target.parsePlayers(playerFactory, data, "nfl");

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Russell Wilson", team: "SEA", salary: 6700, isStarter: true });
            specUtils.assertContainsPlayer(players, { name: "David Johnson", team: "ARI", salary: 7400, isStarter: true });
            specUtils.assertContainsPlayer(players, { name: "Virgil Green", team: "DEN", salary: 2700, isStarter: true });
        });

        it("should parse the starting player information for an NFL FanDuel contest", () => {
            // Arrange
            const target = new RGStarting();
            const data = fs.readFileSync("spec-content/rgStartingNFLFanDuel.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NFL);

            // Act
            const players = target.parsePlayers(playerFactory, data, "nfl");

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Russell Wilson", team: "SEA", salary: 8000, isStarter: true });
            specUtils.assertContainsPlayer(players, { name: "David Johnson", team: "ARI", salary: 8500, isStarter: true });
            specUtils.assertContainsPlayer(players, { name: "Brandon McManus", team: "DEN", salary: 4700, isStarter: true });
        });

        it("should parse the starting player information for an NFL Yahoo contest", () => {
            // Arrange
            const target = new RGStarting();
            const data = fs.readFileSync("spec-content/rgStartingNFLYahoo.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NFL);

            // Act
            const players = target.parsePlayers(playerFactory, data, "nfl");

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Russell Wilson", team: "SEA", salary: 34, isStarter: true });
            specUtils.assertContainsPlayer(players, { name: "David Johnson", team: "ARI", salary: 39, isStarter: true });
            specUtils.assertContainsPlayer(players, { name: "Virgil Green", team: "DEN", salary: 10, isStarter: true });
        });
    });
});
