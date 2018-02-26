import * as fs from "fs";
import FanDuelPlayerCardRetriever from "./fanDuelPlayerCardRetriever";
import * as specUtils from "../specUtils.spec";

describe("FanDuelPlayerCardRetriever", () => {
	describe("#parsePlayerCard()", () => {
		it("should parse the player card retreived from FanDuel", () => {
			// Arrange
			const target = new FanDuelPlayerCardRetriever();
			const playerCardData = fs.readFileSync("spec-content/fanDuelPlayerCard.json", "utf-8");

			// Act
			const card = target.parsePlayerCard(playerCardData, "21011", "13627");

			// Assert
			specUtils.assertPlayerCardEquals(card, {
				gameLog: [
					{
						date: new Date(Date.UTC(2017, 8, 12, 23, 10)),
						opponent: "vs. DET",
						points: 61
					},
					{
						date: new Date(Date.UTC(2017, 8, 8, 0, 10)),
						opponent: "@ CWS",
						points: 64
					},
					{
						date: new Date(Date.UTC(2017, 8, 2, 22, 10)),
						opponent: "@ DET",
						points: 52
					}
				],
				news: [
					{
						date: new Date(Date.UTC(2017, 8, 13, 2, 13, 6)),
						details: "The Indians' ace pushed the team's winning streak to 20 games while facing just three batters over the minimum Tuesday. Over his last nine starts, Kluber is 8-1 with 74 strikeouts -- the most punch outs for any MLB pitcher since Aug. 1 -- and has arguably taken control of the AL Cy Young race. He'll carry a sparkling 2.44 ERA into Sunday's contest at home against the Royals.",
						summary: "Kluber (16-4) tossed a complete-game shutout Tuesday, allowing five hits and no walks while striking out eight Tigers."
					},
					{
						date: new Date(Date.UTC(2017, 8, 8, 3, 31, 2)),
						details: "Kluber was staked to a 4-0 lead in top of the first inning, which was more than enough for the ace to cruise to another victory and improve to 8-1 in his past 10 starts despite allowing a pair of homers in the bottom of the frame. This result also extended Cleveland's winning streak to a franchise-best 15 consecutive games. His team's climb to within 2.5 games of Houston for the best record in the AL has strengthened Kluber's case for a second Cy Young award, with his 2.56 ERA and 12.0 K/9 reminiscent of the 2.44 and 10.3 marks he posted when he captured that honor in 2014. The 31-year-old righty will look to add to his resume in Tuesday's home matchup with a depleted Tigers offense.",
						summary: "Kluber (15-4) beat the White Sox on Thursday after allowing two runs on three hits with one walk and 13 strikeouts in seven innings."
					},
					{
						date: new Date(Date.UTC(2017, 8, 3, 9, 40, 54)),
						details: "This marked the second consecutive outing in which the Klubot went eight innings and the seventh start in a row with three or fewer runs allowed. The only blemish on the evening was an RBI single in the seventh inning, but everything else about his evening was fairly low stress. Kluber's ERA now sits at a stellar 2.56 mark, a figure he'll look to improve further in his next start Thursday against the White Sox.",
						summary: "Kluber (14-4) shined Saturday against the Tigers, allowing just one run on eight hits while striking out seven in eight innings of work en route to the victory."			
					}
				]
			});
		});
	});
});
