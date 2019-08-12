import * as fs from "fs";
import DraftBuddyTeamInsight from "./draftBuddyTeamInsight";
import PlayerFactory from "../playerFactory";
import { ITeamInsight, Sport } from "../interfaces";
import specUtils from "../specUtils.spec";

describe("DFSR", () => {
    describe("#parsePositionData()", () => {
        it("should parse the team insight for an MLB DraftKings contest", () => {
            // Arrange
            const target = new DraftBuddyTeamInsight();
            const data = fs.readFileSync("spec-content/draftBuddyMLBDraftKings.html", "utf-8");
            const playerFactory = new PlayerFactory(Sport.MLB);
            const teamInsight = new Map<string, ITeamInsight>();
            const position = "R";

            // Act
            target.parseTeamInsight(teamInsight, position, playerFactory, data);

            // Assert
            const teamInsightArray = [...teamInsight.values()];
            specUtils.assertContainsTeamInsight(teamInsightArray, { code: "BAL", fullName: "Baltimore Orioles", pointsAllowedPerPosition: [ { position, points: 5851 } ] });
            specUtils.assertContainsTeamInsight(teamInsightArray, { code: "HOU", fullName: "Houston Astros", pointsAllowedPerPosition: [ { position, points: 3643 } ] });
            specUtils.assertContainsTeamInsight(teamInsightArray, { code: "KAN", fullName: "Kansas City Royals", pointsAllowedPerPosition: [ { position, points: 4030 } ] });
        });
    });
});
