import * as fs from "fs";
import NumberFire from "./numberFire";
import PlayerFactory from "../playerFactory";
import { Sport } from "../interfaces";
import specUtils from "../specUtils.spec";

describe("NumberFire", () => {
    describe("#parsePlayers()", () => {
        it("should parse the projection stats for an MLB DraftKings contest", () => {
            // Arrange
            const target = new NumberFire();
            const data = fs.readFileSync("spec-content/numberFireMLBDraftKings.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.MLB);

            // Act
            const players = target.parsePlayers(playerFactory, data);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Anthony Rizzo", team: "CHC", salary: 0, stats: [ { source: "NumberFire", projectedPoints: 8.7 }] });
            specUtils.assertContainsPlayer(players, { name: "Jason Kipnis", team: "CLE", salary: 0, stats: [ { source: "NumberFire", projectedPoints: 8.3 }] });
        });

        it("should parse the projection stats for an MLB FanDuel contest", () => {
            // Arrange
            const target = new NumberFire();
            const data = fs.readFileSync("spec-content/numberFireMLBFanDuel.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.MLB);

            // Act
            const players = target.parsePlayers(playerFactory, data);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Anthony Rizzo", team: "CHC", salary: 0, stats: [ { source: "NumberFire", projectedPoints: 11.4 }] });
            specUtils.assertContainsPlayer(players, { name: "Jason Kipnis", team: "CLE", salary: 0, stats: [ { source: "NumberFire", projectedPoints: 10.8 }] });
        });

        it("should parse the projection stats for an MLB Yahoo contest", () => {
            // Arrange
            const target = new NumberFire();
            const data = fs.readFileSync("spec-content/numberFireMLBYahoo.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.MLB);

            // Act
            const players = target.parsePlayers(playerFactory, data);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Anthony Rizzo", team: "CHC", salary: 0, stats: [ { source: "NumberFire", projectedPoints: 7.2 }] });
            specUtils.assertContainsPlayer(players, { name: "Jason Kipnis", team: "CLE", salary: 0, stats: [ { source: "NumberFire", projectedPoints: 6.9 }] });
        });

        it("should parse the projection stats for an NBA DraftKings contest", () => {
            // Arrange
            const target = new NumberFire();
            const data = fs.readFileSync("spec-content/numberFireNBADraftKings.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NBA);

            // Act
            const players = target.parsePlayers(playerFactory, data);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Russell Westbrook", team: "OKC", salary: 12100, stats: [ { source: "NumberFire", projectedPoints: 59.6 }] });
            specUtils.assertContainsPlayer(players, { name: "Kevin Durant", team: "GS", salary: 9700, stats: [ { source: "NumberFire", projectedPoints: 49.5 }] });
        });

        it("should parse the projection stats for an NBA FanDuel contest", () => {
            // Arrange
            const target = new NumberFire();
            const data = fs.readFileSync("spec-content/numberFireNBAFanDuel.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NBA);

            // Act
            const players = target.parsePlayers(playerFactory, data);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Russell Westbrook", team: "OKC", salary: 12000, stats: [ { source: "NumberFire", projectedPoints: 54.1 }] });
            specUtils.assertContainsPlayer(players, { name: "Kevin Durant", team: "GS", salary: 10400, stats: [ { source: "NumberFire", projectedPoints: 46.8 }] });
        });

        it("should parse the projection stats for an NBA Yahoo contest", () => {
            // Arrange
            const target = new NumberFire();
            const data = fs.readFileSync("spec-content/numberFireNBAYahoo.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NBA);

            // Act
            const players = target.parsePlayers(playerFactory, data);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Russell Westbrook", team: "OKC", salary: 63, stats: [ { source: "NumberFire", projectedPoints: 55.1 }] });
            specUtils.assertContainsPlayer(players, { name: "Kevin Durant", team: "GS", salary: 52, stats: [ { source: "NumberFire", projectedPoints: 47.7 }] });
        });

        it("should parse the projection stats for an NFL DraftKings contest", () => {
            // Arrange
            const target = new NumberFire();
            const data = fs.readFileSync("spec-content/numberFireNFLDraftKings.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NFL);

            // Act
            const players = target.parsePlayers(playerFactory, data);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Aaron Rodgers", team: "GB", salary: 7500, stats: [ { source: "NumberFire", projectedPoints: 22.2 }] });
            specUtils.assertContainsPlayer(players, { name: "Melvin Gordon", team: "SD", salary: 5700, stats: [ { source: "NumberFire", projectedPoints: 17.4 }] });
        });

        it("should parse the projection stats for an NFL FanDuel contest", () => {
            // Arrange
            const target = new NumberFire();
            const data = fs.readFileSync("spec-content/numberFireNFLFanDuel.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NFL);

            // Act
            const players = target.parsePlayers(playerFactory, data);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Aaron Rodgers", team: "GB", salary: 8800, stats: [ { source: "NumberFire", projectedPoints: 21.9 }] });
            specUtils.assertContainsPlayer(players, { name: "Melvin Gordon", team: "SD", salary: 7200, stats: [ { source: "NumberFire", projectedPoints: 15.2 }] });
        });

        it("should parse the projection stats for an NFL Yahoo contest", () => {
            // Arrange
            const target = new NumberFire();
            const data = fs.readFileSync("spec-content/numberFireNFLYahoo.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NFL);

            // Act
            const players = target.parsePlayers(playerFactory, data);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Aaron Rodgers", team: "GB", salary: 37, stats: [ { source: "NumberFire", projectedPoints: 21.9 }] });
            specUtils.assertContainsPlayer(players, { name: "Melvin Gordon", team: "SD", salary: 30, stats: [ { source: "NumberFire", projectedPoints: 15.2 }] });
        });
    });
});
