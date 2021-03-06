import * as assert from "assert";
import * as fs from "fs";
import PlayerFactory from "../../playerFactory";
import RGProjections from "./projections";
import { Sport } from "../../interfaces";
import specUtils from "../../specUtils.spec";

describe("RGProjections", () => {
    describe("#parsePlayers()", () => {
        it("should parse the projections for an MLB DraftKings contest", () => {
            // Arrange
            const target = new RGProjections();
            const data = fs.readFileSync("spec-content/rgProjectionsMLBDraftKings.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.MLB);

            // Act
            const players = target.parsePlayers(playerFactory, data);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Kole Calhoun", team: "LAA", salary: 2700, stats: [{ source: "RotoGrinders", projectedPoints: 7.19 }] });
            specUtils.assertContainsPlayer(players, { name: "Lorenzo Cain", team: "KAN", salary: 4600, stats: [{ source: "RotoGrinders", projectedPoints: 7.46 }] });
            specUtils.assertContainsPlayer(players, { name: "Aaron Judge", team: "NYY", salary: 5200, stats: [{ source: "RotoGrinders", projectedPoints: 6.88 }] });
        });

        it("should parse the projections for an MLB FanDuel contest", () => {
            // Arrange
            const target = new RGProjections();
            const data = fs.readFileSync("spec-content/rgProjectionsMLBFanDuel.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.MLB);

            // Act
            const players = target.parsePlayers(playerFactory, data);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Kole Calhoun", team: "LAA", salary: 2800, stats: [{ source: "RotoGrinders", projectedPoints: 9.39 }] });
            specUtils.assertContainsPlayer(players, { name: "Lorenzo Cain", team: "KAN", salary: 3600, stats: [{ source: "RotoGrinders", projectedPoints: 9.9 }] });
            specUtils.assertContainsPlayer(players, { name: "Aaron Judge", team: "NYY", salary: 4300, stats: [{ source: "RotoGrinders", projectedPoints: 8.93 }] });
        });

        it("should parse the projections for an NBA DraftKings contest", () => {
            // Arrange
            const target = new RGProjections();
            const data = fs.readFileSync("spec-content/rgProjectionsNBADraftKings.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NBA);

            // Act
            const players = target.parsePlayers(playerFactory, data);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Blake Griffin", team: "LAC", salary: 8600, stats: [{ source: "RotoGrinders", projectedPoints: 40.83, projectedCeiling: 52.6707, projectedFloor: 28.9893 }] });
            specUtils.assertContainsPlayer(players, { name: "Kawhi Leonard", team: "SA", salary: 8400, stats: [{ source: "RotoGrinders", projectedPoints: 40.23, projectedCeiling: 49.0806, projectedFloor: 31.3794 }] });
            specUtils.assertContainsPlayer(players, { name: "Jimmy Butler", team: "CHI", salary: 7400, stats: [{ source: "RotoGrinders", projectedPoints: 35.33, projectedCeiling: 45.929, projectedFloor: 24.731 }] });
        });

        it("should parse the projections for an NBA FanDuel contest", () => {
            // Arrange
            const target = new RGProjections();
            const data = fs.readFileSync("spec-content/rgProjectionsNBAFanDuel.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NBA);

            // Act
            const players = target.parsePlayers(playerFactory, data);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Blake Griffin", team: "LAC", salary: 8600, stats: [{ source: "RotoGrinders", projectedPoints: 39.15, projectedCeiling: 50.5035, projectedFloor: 27.7965 }] });
            specUtils.assertContainsPlayer(players, { name: "Kawhi Leonard", team: "SA", salary: 8200, stats: [{ source: "RotoGrinders", projectedPoints: 37.96, projectedCeiling: 46.3112, projectedFloor: 29.6088 }] });
            specUtils.assertContainsPlayer(players, { name: "Jimmy Butler", team: "CHI", salary: 8200, stats: [{ source: "RotoGrinders", projectedPoints: 33.42, projectedCeiling: 43.446, projectedFloor: 23.394 }] });
        });

        it("should parse the projections for an NFL DraftKings contest", () => {
            // Arrange
            const target = new RGProjections();
            const data = fs.readFileSync("spec-content/rgProjectionsNFLDraftKings.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NFL);

            // Act
            const players = target.parsePlayers(playerFactory, data);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Tom Brady", team: "NE", salary: 7600, stats: [{ source: "RotoGrinders", projectedPoints: 25.73, projectedCeiling: 31.3906, projectedFloor: 20.0694 }] });
            specUtils.assertContainsPlayer(players, { name: "Drew Brees", team: "NO", salary: 6900, stats: [{ source: "RotoGrinders", projectedPoints: 20.69, projectedCeiling: 26.897, projectedFloor: 14.483 }] });
        });

        it("should parse the projections for an NFL FanDuel contest", () => {
            // Arrange
            const target = new RGProjections();
            const data = fs.readFileSync("spec-content/rgProjectionsNFLFanDuel.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NFL);

            // Act
            const players = target.parsePlayers(playerFactory, data);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Tom Brady", team: "NE", salary: 8700, stats: [{ source: "RotoGrinders", projectedPoints: 22.31, projectedCeiling: 27.2182, projectedFloor: 17.4018 }] });
            specUtils.assertContainsPlayer(players, { name: "Drew Brees", team: "NO", salary: 8000, stats: [{ source: "RotoGrinders", projectedPoints: 20.44, projectedCeiling: 26.572, projectedFloor: 14.308 }] });
        });
    });
});
