import { IPlayer, IPlayerInsightRetriever, IPlayerStats, ContestType, Sport } from "../interfaces";
import PlayerFactory from "../playerFactory";
import utils from "../utils";

interface IIndexMapping {
	nameIndex: number;
	teamIndex: number;
	pointsIndex: number;
	salaryIndex: number;
}

export default class DFSR implements IPlayerInsightRetriever {
	// URLs for DraftKings data
	private static draftKingsMLBSiteURL = "/data/baseball.draft_kings.csv";
	private static draftKingsNBASiteURL = "/data/basketball.draft_kings.csv";
	private static draftKingsNFLSiteURL = "/data/football.draft_kings.csv";
	private static draftKingsNHLSiteURL = "/data/hockey.draft_kings.csv";

	// URLs for FanDuel data
	private static fanDuelMLBSiteURL = "/data/baseball.fan_duel.csv";
	private static fanDuelNBASiteURL = "/data/basketball.fan_duel.csv";
	private static fanDuelNFLSiteURL = "/data/football.fan_duel.csv";
	private static fanDuelNHLSiteURL = "/data/hockey.fan_duel.csv";

	// URLs for Yahoo data
	private static yahooMLBSiteURL = "/data/baseball.yahoo.csv";
	private static yahooNBASiteURL = "/data/basketball.yahoo.csv";
	private static yahooNFLSiteURL = "/data/football.yahoo.csv";
	private static yahooNHLSiteURL = "/data/hockey.yahoo.csv";

	// Indices for the sports
	private static mlbIndices: IIndexMapping = {
		nameIndex: 1,
		teamIndex: 10,
		pointsIndex: 2,
		salaryIndex: 3
	};
	private static nbaIndices: IIndexMapping = {
		nameIndex: 1,
		teamIndex: 7,
		pointsIndex: 2,
		salaryIndex: 3
	};
	private static nflIndices: IIndexMapping = {
		nameIndex: 1,
		teamIndex: 2,
		pointsIndex: 4,
		salaryIndex: 6
	};
	private static nhlIndices: IIndexMapping = {
		nameIndex: 1,
		teamIndex: 6,
		pointsIndex: 2,
		salaryIndex: 4
	};

	playerInsight(contestType: ContestType, sport: Sport): PromiseLike<IPlayer[]> {
		const playerFactory = new PlayerFactory(sport);
		switch (contestType) {
			case ContestType.DraftKings:
				switch (sport) {
					case Sport.MLB:
						return this.getData(playerFactory, DFSR.draftKingsMLBSiteURL, DFSR.mlbIndices);
					case Sport.NBA:
						return this.getData(playerFactory, DFSR.draftKingsNBASiteURL, DFSR.nbaIndices);
					case Sport.NFL:
						return this.getData(playerFactory, DFSR.draftKingsNFLSiteURL, DFSR.nflIndices);
					case Sport.NHL:
						return this.getData(playerFactory, DFSR.draftKingsNHLSiteURL, DFSR.nhlIndices);
				}
				break;
			case ContestType.FanDuel:
				switch (sport) {
					case Sport.MLB:
						return this.getData(playerFactory, DFSR.fanDuelMLBSiteURL, DFSR.mlbIndices);
					case Sport.NBA:
						return this.getData(playerFactory, DFSR.fanDuelNBASiteURL, DFSR.nbaIndices);
					case Sport.NFL:
						return this.getData(playerFactory, DFSR.fanDuelNFLSiteURL, DFSR.nflIndices);
					case Sport.NHL:
						return this.getData(playerFactory, DFSR.fanDuelNHLSiteURL, DFSR.nhlIndices);
				}
				break;
			case ContestType.Yahoo:
				switch (sport) {
					case Sport.MLB:
						return this.getData(playerFactory, DFSR.yahooMLBSiteURL, DFSR.mlbIndices);
					case Sport.NBA:
						return this.getData(playerFactory, DFSR.yahooNBASiteURL, DFSR.nbaIndices);
					case Sport.NFL:
						return this.getData(playerFactory, DFSR.yahooNFLSiteURL, DFSR.nflIndices);
					case Sport.NHL:
						return this.getData(playerFactory, DFSR.yahooNHLSiteURL, DFSR.nhlIndices);
				}
				break;
		}
		return Promise.reject<IPlayer[]>("An unknown contest type or sport was specified");
	}

	private getData(playerFactory: PlayerFactory, siteURL: string, indices: IIndexMapping): PromiseLike<IPlayer[]> {
		return utils.sendHttpsRequest({
			hostname: "www.dailyfantasysportsrankings.com",
			path: siteURL,
			method: "GET"
		}).then((dataResp) => {
			return this.parsePlayersIndices(playerFactory, dataResp.body, indices);
		});
	}

	private parsePlayersIndices(playerFactory: PlayerFactory, data: string, indices: IIndexMapping): IPlayer[] {
		if (!indices) {
			return undefined;
		}
		return this.parsePlayers(playerFactory, data, indices.nameIndex, indices.teamIndex, indices.pointsIndex, indices.salaryIndex);
	}

	parsePlayers(playerFactory: PlayerFactory, data: string, nameIndex: number, teamIndex: number, pointsIndex: number, salaryIndex: number): IPlayer[] {
		if (data) {
			return data.split(/\r?\n/).map(line => {
				if (line) {
					const parts = line.split(/,/);
					if (parts && nameIndex < parts.length && teamIndex < parts.length && pointsIndex < parts.length && salaryIndex < parts.length) {
						const name = parts[nameIndex];
						const team = parts[teamIndex];
						const salary = utils.coerceInt(parts[salaryIndex]);
						const player = playerFactory.createPlayer(name, team, salary);
						player.stats = [
							{
								source: "DailyFantasySportsRankings",
								projectedPoints: utils.coerceFloat(parts[pointsIndex])
							}
						];
						return player;
					}
				}
				return undefined;
			}).filter(p => !!p);
		}
		return undefined;
	}
}
