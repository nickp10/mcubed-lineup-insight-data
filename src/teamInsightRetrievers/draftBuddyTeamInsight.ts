import { ITeamInsight, ITeamInsightRetriever, ContestType, Sport } from "../interfaces";
import PlayerFactory from "../playerFactory";
import * as cheerio from "cheerio";
import utils from "../utils";

interface IPositionQuery {
    position: string;
    query: string;
}

interface IPositionData {
    teamFullName: string;
    teamCode: string;
    points: number;
}

export default class DraftBuddyTeamInsight implements ITeamInsightRetriever {
    async teamInsight(contestType: ContestType, sport: Sport): Promise<ITeamInsight[]> {
        const playerFactory = new PlayerFactory(sport);
        const positionQueries = this.getPositionQueries(sport);
        if (positionQueries) {
            switch (contestType) {
                case ContestType.DraftKings:
                    switch (sport) {
                        case Sport.MLB:
                            return await this.getData(playerFactory, positionQueries, "baseball", "1");
                        case Sport.NFL:
                            return await this.getData(playerFactory, positionQueries, "football", "4");
                    }
                    break;
                case ContestType.FanDuel:
                    switch (sport) {
                        case Sport.MLB:
                            return await this.getData(playerFactory, positionQueries, "baseball", "2");
                        case Sport.NFL:
                            return await this.getData(playerFactory, positionQueries, "football", "3");
                    }
                    break;
                case ContestType.Yahoo:
                    switch (sport) {
                        case Sport.MLB:
                            return await this.getData(playerFactory, positionQueries, "baseball", "7");
                    }
                    break;
            }
        }
        return Promise.resolve(undefined);
    }

    private getPositionQueries(sport: Sport): IPositionQuery[] {
        switch (sport) {
            case Sport.MLB:
                return [
                    { position: "BAT-R", query: "Pos=H&Side=R" },
                    { position: "BAT-L", query: "Pos=H&Side=L" },
                    { position: "BAT-S", query: "Pos=H&Side=S" },
                    { position: "PITCH-R", query: "Pos=P&Side=R" },
                    { position: "PITCH-L", query: "Pos=P&Side=L" }
                ];
            case Sport.NFL:
                return [
                    { position: "QB", query: "Pos=QB" },
                    { position: "RB", query: "Pos=RB" },
                    { position: "WR", query: "Pos=WR" },
                    { position: "TE", query: "Pos=TE" },
                    { position: "K", query: "Pos=K" },
                    { position: "DEF", query: "Pos=DEF" }
                ];
        }
        return undefined;
    }

    private async getData(playerFactory: PlayerFactory, positionQueries: IPositionQuery[], sport: string, contest: string): Promise<ITeamInsight[]> {
        const teamInsight = new Map<string, ITeamInsight>();
        for (const positionQuery of positionQueries) {
            const positionQueryResponse = await utils.sendHttpsRequest({
                hostname: "draftbuddy.com",
                path: `/${sport}/fantasy_points_allowed.php?${positionQuery.query}&L=${contest}`,
                method: "GET"
            });
            if (positionQueryResponse && positionQueryResponse.body) {
                this.parseTeamInsight(teamInsight, positionQuery.position, playerFactory, positionQueryResponse.body);
            }
        }
        return [...teamInsight.values()];
    }

    parseTeamInsight(teamInsight: Map<string, ITeamInsight>, position: string, playerFactory: PlayerFactory, data: string): void {
        const positionDataElements = this.parsePositionData(playerFactory, data);
        if (positionDataElements) {
            for (const positionDataElement of positionDataElements) {
                let currentTeam = teamInsight.get(positionDataElement.teamCode);
                if (!currentTeam) {
                    currentTeam = {
                        code: positionDataElement.teamCode,
                        fullName: positionDataElement.teamFullName,
                        pointsAllowedPerPosition: []
                    };
                    teamInsight.set(currentTeam.code, currentTeam);
                }
                currentTeam.pointsAllowedPerPosition.push({
                    position,
                    points: positionDataElement.points,
                    source: "Draft Buddy"
                });
            }
        }
    }

    private parsePositionData(playerFactory: PlayerFactory, data: string): IPositionData[] {
        return this.parsePositionDataCheerio(playerFactory, cheerio.load(data));
    }

    private parsePositionDataCheerio(playerFactory: PlayerFactory, $: CheerioStatic): IPositionData[] {
        const positionData: IPositionData[] = [];
        let teamIndex = -1;
        let pointsIndex = -1;
        $(".table-condensed th").each((index, header) => {
            const id = $(header).attr("id");
            if (!id) {
                teamIndex = index;
            } else if (id === "FPts") {
                pointsIndex = index;
            }
        });
        if (teamIndex > -1 && pointsIndex > -1) {
            $(".table-condensed tbody tr").each((index, row) => {
                const teamCell = $(row).find("td").get(teamIndex);
                const teamFullName = $(teamCell).find("a").html();
                const teamURL = $(teamCell).find("a").attr("href");
                const teamURLMatcher = teamURL.match(/.*Team=(\w+).*/);
                const teamCodeMatch = teamURLMatcher && teamURLMatcher.length > 1 ? teamURLMatcher[1] : undefined;
                const teamCode = teamCodeMatch ? playerFactory.normalizeTeam(teamCodeMatch) : undefined;
                const pointsCell = $(row).find("td").get(pointsIndex);
                const points = utils.coerceFloat($(pointsCell).html().replace(/,/g, "")) || 0;
                if (teamCode) {
                    positionData.push({
                        teamCode,
                        teamFullName,
                        points
                    });
                }
            });
        }
        return positionData;
    }
}
