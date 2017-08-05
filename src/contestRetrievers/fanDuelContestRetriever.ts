import { IContestListRetriever, IContest, IFanDuelContest, IGame, IPlayer, IPlayerInjury, ITeam, ContestType, InjuryType, NewsStatus, Sport } from "../interfaces";
import PlayerFactory from "../playerFactory";
import * as utils from "../utils";

export default class FanDuelContestRetriever implements IContestListRetriever {
	static MILLIS_IN_DAY = 86400000;

	contestType = ContestType.FanDuel;

	contestList(sport: Sport): PromiseLike<IContest[]> {
		return this.getContestList(sport);
	}

	getContestList(sport: Sport): PromiseLike<IFanDuelContest[]> {
		return utils.sendHttpsRequest({
			hostname: "api.fanduel.com",
			path: "/fixture-lists",
			method: "GET",
			headers: {
				"Authorization": "Basic N2U3ODNmMTE4OTIzYzE2NzVjNWZhYWFmZTYwYTc5ZmM6"
			}
		}).then((dataResp) => {
			const contests = this.parseContests(dataResp.body, sport);
			return this.queryContestSpecificData(contests);
		});
	}

	getContestSpecificData(contest: IFanDuelContest): PromiseLike<IFanDuelContest> {
		return utils.sendHttpsRequest({
			hostname: "api.fanduel.com",
			path: contest.contestURL.replace("https://api.fanduel.com", ""),
			method: "GET",
			headers: {
				"Authorization": "Basic N2U3ODNmMTE4OTIzYzE2NzVjNWZhYWFmZTYwYTc5ZmM6"
			}
		}).then((dataResp) => {
			this.parseContestSpecificData(contest, dataResp.body);
			return this.queryContestPlayerList(contest);
		});
	}

	getContestPlayerList(contest: IFanDuelContest): PromiseLike<IFanDuelContest> {
		return utils.sendHttpsRequest({
			hostname: "api.fanduel.com",
			path: contest.playersURL.replace("https://api.fanduel.com", ""),
			method: "GET",
			headers: {
				"Authorization": "Basic N2U3ODNmMTE4OTIzYzE2NzVjNWZhYWFmZTYwYTc5ZmM6"
			}
		}).then((dataResp) => {
			this.parseContestPlayerList(contest, dataResp.body);
			return contest;
		});
	}

	queryContestSpecificData(contests: IFanDuelContest[]): PromiseLike<IFanDuelContest[]> {
		const promises: PromiseLike<IFanDuelContest>[] = [];
		for (let i = 0; i < contests.length; i++) {
			const contest = contests[i];
			promises.push(this.getContestSpecificData(contest));
		}
		return Promise.all(promises);
	}

	queryContestPlayerList(contest: IFanDuelContest): PromiseLike<IFanDuelContest> {
		return this.getContestPlayerList(contest);
	}

	parseContests(data: string, sport: Sport): IFanDuelContest[] {
		const jsonData = JSON.parse(data);
		const returnContests: IFanDuelContest[] = [];
		if (jsonData) {
			const contests = jsonData.fixture_lists;
			if (Array.isArray(contests)) {
				for (let i = 0; i < contests.length; i++) {
					const contest = contests[i];
					const fdContest: IFanDuelContest = {
						ID: `FD${contest["id"]}`,
						label: contest["label"],
						contestType: utils.coerceContestType("FanDuel"),
						sport: utils.coerceSport(contest["sport"]),
						maxSalary: contest["salary_cap"],
						contestURL: contest["_url"],
						playersURL: contest["players"]["_url"],
						startTime: new Date(contest["start_date"])
					};
					if ((!sport && fdContest.sport) || (sport && fdContest.sport === sport)) {
						returnContests.push(fdContest);
					}
				}
			}
		}
		return returnContests;
	}

	parseContestSpecificData(fdContest: IFanDuelContest, contestData: string): void {
		const jsonData = JSON.parse(contestData);
		if (jsonData) {
			const contests = jsonData.fixture_lists;
			if (Array.isArray(contests)) {
				const contest = contests.find((c) => `FD${c["id"]}` === fdContest.ID);
				if (contest) {
					fdContest.maxPlayersPerTeam = contest["roster_restrictions"]["max_players_from_team"];
					const positions = contest["roster_positions"];
					if (Array.isArray(positions)) {
						fdContest.positions = positions.map(p => p["abbr"]);
					}
					const fixtures = jsonData["fixtures"];
					if (Array.isArray(fixtures)) {
						fdContest.games = fixtures.map(f => this.parseGame(jsonData, f));
					}
				}
			}
		}
	}

	parseGame(contestData: any, gameData: any): IGame {
		return {
			awayTeam: this.parseTeam(contestData, gameData["away_team"]),
			homeTeam: this.parseTeam(contestData, gameData["home_team"]),
			startTime: new Date(gameData["start_date"])
		};
	}

	parseTeam(contestData: any, teamData: any): ITeam {
		const teamID = teamData["team"]["_members"][0];
		const team = contestData["teams"].find(t => t["id"] === teamID);
		return {
			code: (<string>team["code"]).toUpperCase(),
			fullName: team["full_name"]
		};
	}

	parseContestPlayerList(fdContest: IFanDuelContest, playerListData: string): void {
		const players: IPlayer[] = [];
		const playerFactory = new PlayerFactory(fdContest.sport);
		const jsonData = JSON.parse(playerListData);
		if (jsonData) {
			const jsonPlayers = jsonData.players;
			if (Array.isArray(jsonPlayers)) {
				for (let i = 0; i < jsonPlayers.length; i++) {
					const jsonPlayer = jsonPlayers[i];
					const name = `${jsonPlayer["first_name"]} ${jsonPlayer["last_name"]}`;
					const teamID = jsonPlayer["team"]["_members"][0];
					const team = jsonData["teams"].find(t => t["id"] === teamID);
					const player = playerFactory.createPlayer(name, team["code"], jsonPlayer["salary"]);
					player.battingOrder = this.parseBattingOrder(jsonPlayer["starting_order"]);
					player.ID = this.parseID(jsonPlayer["id"]);
					player.injury = this.parseInjuryStatus(jsonPlayer["injury_status"]);
					player.isProbablePitcher = jsonPlayer["probable_pitcher"];
					player.isStarter = fdContest.sport === Sport.NFL && utils.equalsIgnoreCase(jsonPlayer["position"], "D")
					player.newsStatus = this.parseNewsStatus(jsonPlayer);
					player.position = jsonPlayer["position"];
					player.stats = [
						{
							source: "FanDuel",
							seasonAveragePoints: utils.coerceFloat(jsonPlayer["fppg"])
						}
					];
					players.push(player);
				}
			}
		}
		this.attachPlayersToTeams(fdContest, players);
	}

	parseBattingOrder(battingOrder: string): string {
		const order = utils.coerceInt(battingOrder);
		if (order === 1) {
			return "1st";
		} else if (order === 2) {
			return "2nd";
		} else if (order === 3) {
			return "3rd";
		} else if (order > 3 && order < 10) {
			return `${order}th`;
		}
		return "NA";
	}

	parseID(id: string): string {
		const idParts = id ? id.split("-") : undefined;
		if (Array.isArray(idParts) && idParts.length === 2) {
			return idParts[1];
		}
		return id;
	}

	parseInjuryStatus(injuryStatus: string): IPlayerInjury {
		if (utils.equalsIgnoreCase(injuryStatus, "DL") || utils.equalsIgnoreCase(injuryStatus, "IR") || utils.equalsIgnoreCase(injuryStatus, "NA") || utils.equalsIgnoreCase(injuryStatus, "O")) {
			return {
				display: injuryStatus,
				injuryType: InjuryType.Out
			};
		} else if (utils.equalsIgnoreCase(injuryStatus, "D") || utils.equalsIgnoreCase(injuryStatus, "DTD") || utils.equalsIgnoreCase(injuryStatus, "GTD") || utils.equalsIgnoreCase(injuryStatus, "Q")) {
			return {
				display: injuryStatus,
				injuryType: InjuryType.Possible
			};
		} else if (utils.equalsIgnoreCase(injuryStatus, "P")) {
			return {
				display: injuryStatus,
				injuryType: InjuryType.Probable
			};
		}
		return undefined;
	}

	parseNewsStatus(jsonPlayer: any): NewsStatus {
		const news = jsonPlayer["news"];
		if (news) {
			const latestNews = new Date(news["latest"]);
			if (latestNews) {
				const nowMillis = Date.now();
				const latestMillis = latestNews.getTime();
				const millisDiff = nowMillis - latestMillis;
				if (millisDiff < FanDuelContestRetriever.MILLIS_IN_DAY) {
					return NewsStatus.Breaking;
				} else if (millisDiff < (7 * FanDuelContestRetriever.MILLIS_IN_DAY)) {
					return NewsStatus.Recent;
				}
			}
		}
		return NewsStatus.None;
	}

	attachPlayersToTeams(fdContest: IFanDuelContest, players: IPlayer[]): void {
		const teamMap = new Map<string, ITeam>();
		for (let i = 0; i < fdContest.games.length; i++) {
			const game = fdContest.games[i];
			teamMap.set(game.awayTeam.code, game.awayTeam);
			teamMap.set(game.homeTeam.code, game.homeTeam);
		}
		for (let i = 0; i < players.length; i++) {
			const player = players[i];
			const team = teamMap.get(player.team);
			const teamPlayers = team.players;
			if (Array.isArray(teamPlayers)) {
				teamPlayers.push(player);
			} else {
				team.players = [ player ];
			}
		}
	}
}
