import * as assert from "assert";
import * as fs from "fs";
import PlayerFactory from "../../playerFactory";
import RGRecent from "./recent";
import { Sport } from "../../interfaces";
import specUtils from "../../specUtils.spec";

describe("RGRecent", () => {
    describe("#parsePlayers()", () => {
        it("should parse the recent stats for an NBA DraftKings contest", () => {
            // Arrange
            const target = new RGRecent();
            const data = fs.readFileSync("spec-content/rgRecentNBADraftKings.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NBA);

            // Act
            const players = target.parsePlayers(playerFactory, data);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "LeBron James", team: "CLE", salary: 9900, stats: [{ source: "RotoGrinders", recentAveragePoints: 60.38 }] });
            specUtils.assertContainsPlayer(players, { name: "Danilo Gallinari", team: "DEN", salary: 5800, stats: [{ source: "RotoGrinders", recentAveragePoints: 27.25 }] });
            specUtils.assertContainsPlayer(players, { name: "DeMarcus Cousins", team: "SAC", salary: 10400, stats: [{ source: "RotoGrinders", recentAveragePoints: 44.42 }] });
        });

        it("should parse the recent stats for an NBA FanDuel contest", () => {
            // Arrange
            const target = new RGRecent();
            const data = fs.readFileSync("spec-content/rgRecentNBAFanDuel.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NBA);

            // Act
            const players = target.parsePlayers(playerFactory, data);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "LeBron James", team: "CLE", salary: 9900, stats: [{ source: "RotoGrinders", recentAveragePoints: 55.5 }] });
            specUtils.assertContainsPlayer(players, { name: "Danilo Gallinari", team: "DEN", salary: 6100, stats: [{ source: "RotoGrinders", recentAveragePoints: 24.9 }] });
            specUtils.assertContainsPlayer(players, { name: "DeMarcus Cousins", team: "SAC", salary: 9500, stats: [{ source: "RotoGrinders", recentAveragePoints: 42.67 }] });
        });

        it("should parse the recent stats for an NBA Yahoo contest", () => {
            // Arrange
            const target = new RGRecent();
            const data = fs.readFileSync("spec-content/rgRecentNBAYahoo.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NBA);

            // Act
            const players = target.parsePlayers(playerFactory, data);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "LeBron James", team: "CLE", salary: 53, stats: [{ source: "RotoGrinders", recentAveragePoints: 56 }] });
            specUtils.assertContainsPlayer(players, { name: "Danilo Gallinari", team: "DEN", salary: 28, stats: [{ source: "RotoGrinders", recentAveragePoints: 26.23 }] });
            specUtils.assertContainsPlayer(players, { name: "DeMarcus Cousins", team: "SAC", salary: 52, stats: [{ source: "RotoGrinders", recentAveragePoints: 42.83 }] });
        });
    });
});
