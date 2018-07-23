import * as fs from "fs";
import DFSR from "./dfsr";
import PlayerFactory from "../playerFactory";
import { Sport } from "../interfaces";
import specUtils from "../specUtils.spec";

describe("DFSR", () => {
    describe("#parsePlayers()", () => {
        it("should parse the projection stats for an MLB DraftKings contest", () => {
            // Arrange
            const csvOptions = DFSR.draftKingsMLBCSVOptions;
            const target = new DFSR();
            const data = fs.readFileSync("spec-content/dfsrMLB.csv", "utf-8");
            const playerFactory = new PlayerFactory(Sport.MLB);

            // Act
            const players = target.parsePlayers(playerFactory, data, csvOptions);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Mookie Betts", team: "BOS", salary: 6200, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 10.50953059, projectedFloor: 5.465665619, projectedCeiling: 15.55339556 }] });
            specUtils.assertContainsPlayer(players, { name: "Rhys Hoskins", team: "PHI", salary: 3900, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 8.241344116, projectedFloor: 4.20486106, projectedCeiling: 12.27782717 }] });
        });

        it("should parse the projection stats for an MLB FanDuel contest", () => {
            // Arrange
            const csvOptions = DFSR.fanDuelMLBCSVOptions;
            const target = new DFSR();
            const data = fs.readFileSync("spec-content/dfsrMLB.csv", "utf-8");
            const playerFactory = new PlayerFactory(Sport.MLB);

            // Act
            const players = target.parsePlayers(playerFactory, data, csvOptions);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Mookie Betts", team: "BOS", salary: 5000, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 13.90805479, projectedFloor: 8.808734045, projectedCeiling: 19.00737553 }] });
            specUtils.assertContainsPlayer(players, { name: "Rhys Hoskins", team: "PHI", salary: 3800, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 11.05682593, projectedFloor: 6.794435271, projectedCeiling: 15.31921659 }] });
        });

        it("should parse the projection stats for an MLB Yahoo contest", () => {
            // Arrange
            const csvOptions = DFSR.yahooMLBCSVOptions;
            const target = new DFSR();
            const data = fs.readFileSync("spec-content/dfsrMLB.csv", "utf-8");
            const playerFactory = new PlayerFactory(Sport.MLB);

            // Act
            const players = target.parsePlayers(playerFactory, data, csvOptions);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Mookie Betts", team: "BOS", salary: undefined, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: undefined }] });
            specUtils.assertContainsPlayer(players, { name: "Rhys Hoskins", team: "PHI", salary: undefined, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: undefined }] });
        });

        it("should parse the projection stats for an NBA DraftKings contest", () => {
            // Arrange
            const csvOptions = DFSR.draftKingsNBACSVOptions;
            const target = new DFSR();
            const data = fs.readFileSync("spec-content/dfsrNBA.csv", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NBA);

            // Act
            const players = target.parsePlayers(playerFactory, data, csvOptions);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "LeBron James", team: "CLE", salary: 20000, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 73.94516769 }] });
            specUtils.assertContainsPlayer(players, { name: "Al Horford", team: "BOS", salary: 11700, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 41.86153742 }] });
        });

        it("should parse the projection stats for an NBA FanDuel contest", () => {
            // Arrange
            const csvOptions = DFSR.fanDuelNBACSVOptions;
            const target = new DFSR();
            const data = fs.readFileSync("spec-content/dfsrNBA.csv", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NBA);

            // Act
            const players = target.parsePlayers(playerFactory, data, csvOptions);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "LeBron James", team: "CLE", salary: 13700, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 71.13370437 }] });
            specUtils.assertContainsPlayer(players, { name: "Al Horford", team: "BOS", salary: 7400, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 41.37531445 }] });
        });

        it("should parse the projection stats for an NFL DraftKings contest", () => {
            // Arrange
            const csvOptions = DFSR.draftKingsNFLCSVOptions;
            const target = new DFSR();
            const data = fs.readFileSync("spec-content/dfsrNFLDraftKings.csv", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NFL);

            // Act
            const players = target.parsePlayers(playerFactory, data, csvOptions);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Tom Brady", team: "NE", salary: 7700, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 17.86729699 }] });
            specUtils.assertContainsPlayer(players, { name: "Zach Ertz", team: "PHI", salary: 5300, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 12.56613019 }] });
        });

        it("should parse the projection stats for an NFL FanDuel contest", () => {
            // Arrange
            const csvOptions = DFSR.fanDuelNFLCSVOptions;
            const target = new DFSR();
            const data = fs.readFileSync("spec-content/dfsrNFLFanDuel.csv", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NFL);

            // Act
            const players = target.parsePlayers(playerFactory, data, csvOptions);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Tom Brady", team: "NE", salary: 9000, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 17.41886223 }] });
            specUtils.assertContainsPlayer(players, { name: "Zach Ertz", team: "PHI", salary: 7000, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 10.21689655 }] });
        });

        it("should parse the projection stats for an NHL DraftKings contest", () => {
            // Arrange
            const csvOptions = DFSR.draftKingsNHLCSVOptions;
            const target = new DFSR();
            const data = fs.readFileSync("spec-content/dfsrNHL.csv", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NHL);

            // Act
            const players = target.parsePlayers(playerFactory, data, csvOptions);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Alex Ovechkin", team: "WAS", salary: 7600, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 5.115410248 }] });
            specUtils.assertContainsPlayer(players, { name: "Patric Hornqvist", team: "PIT", salary: 6100, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 2.747319079 }] });
        });

        it("should parse the projection stats for an NHL FanDuel contest", () => {
            // Arrange
            const csvOptions = DFSR.fanDuelNHLCSVOptions;
            const target = new DFSR();
            const data = fs.readFileSync("spec-content/dfsrNHL.csv", "utf-8");
            const playerFactory = new PlayerFactory(Sport.NHL);

            // Act
            const players = target.parsePlayers(playerFactory, data, csvOptions);

            // Assert
            specUtils.assertContainsPlayer(players, { name: "Alex Ovechkin", team: "WAS", salary: 9000, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 17.53975396 }] });
            specUtils.assertContainsPlayer(players, { name: "Patric Hornqvist", team: "PIT", salary: 6700, stats: [ { source: "DailyFantasySportsRankings", projectedPoints: 9.074171053 }] });
        });
    });
});
