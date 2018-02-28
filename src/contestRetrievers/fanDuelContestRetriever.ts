import { IContestListRetriever, IContest, IGame, IPlayer, IPlayerInjury, ITeam, ContestType, InjuryType, NewsStatus, Sport } from "../interfaces";
import PlayerFactory from "../playerFactory";
import utils from "../utils";

export default class FanDuelContestRetriever implements IContestListRetriever {
	private static FAN_DUEL_ID_PREFIX = "FD";
	private static MILLIS_IN_DAY = 86400000;

	contestType = ContestType.FanDuel;

	contestList(sport: Sport): PromiseLike<IContest[]> {
		return this.getContestList(sport);
	}

	private getContestList(sport: Sport): PromiseLike<IContest[]> {
		return utils.sendHttpsRequest({
			hostname: "api.fanduel.com",
			path: "/fixture-lists",
			method: "GET",
			headers: {
				"Authorization": "Basic N2U3ODNmMTE4OTIzYzE2NzVjNWZhYWFmZTYwYTc5ZmM6"
			}
		}).then((dataResp) => {
			const contests = this.parseContestList(dataResp.body, sport);
			return this.queryContestSpecificData(contests);
		});
	}

	private getContestSpecificData(contest: IContest): PromiseLike<IContest> {
		return utils.sendHttpsRequest({
			hostname: "api.fanduel.com",
			path: `/fixture-lists/${this.getRawContestID(contest)}`,
			method: "GET",
			headers: {
				"Authorization": "Basic N2U3ODNmMTE4OTIzYzE2NzVjNWZhYWFmZTYwYTc5ZmM6"
			}
		}).then((dataResp) => {
			this.parseContestSpecificData(contest, dataResp.body);
			return this.queryContestPlayerList(contest);
		});
	}

	private getContestPlayerList(contest: IContest): PromiseLike<IContest> {
		return utils.sendHttpsRequest({
			hostname: "api.fanduel.com",
			path: `/fixture-lists/${this.getRawContestID(contest)}/players`,
			method: "GET",
			headers: {
				"Authorization": "Basic N2U3ODNmMTE4OTIzYzE2NzVjNWZhYWFmZTYwYTc5ZmM6"
			}
		}).then((dataResp) => {
			this.parseContestPlayerList(contest, dataResp.body);
			return contest;
		});
	}

	private queryContestSpecificData(contests: IContest[]): PromiseLike<IContest[]> {
		const promises: PromiseLike<IContest>[] = [];
		for (let i = 0; i < contests.length; i++) {
			const contest = contests[i];
			promises.push(this.getContestSpecificData(contest));
		}
		return Promise.all(promises);
	}

	private queryContestPlayerList(contest: IContest): PromiseLike<IContest> {
		return this.getContestPlayerList(contest);
	}

	parseContestList(data: string, sport: Sport): IContest[] {
		const jsonData = JSON.parse(data);
		const returnContests: IContest[] = [];
		if (jsonData) {
			const contests = jsonData.fixture_lists;
			if (Array.isArray(contests)) {
				for (let i = 0; i < contests.length; i++) {
					const contest = contests[i];
					const fdContest: IContest = {
						ID: `${FanDuelContestRetriever.FAN_DUEL_ID_PREFIX}${contest["id"]}`,
						label: contest["label"],
						contestType: ContestType.FanDuel,
						sport: utils.coerceSport(contest["sport"]),
						maxSalary: contest["salary_cap"],
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

	parseContestSpecificData(fdContest: IContest, contestData: string): void {
		const jsonData = JSON.parse(contestData);
		if (jsonData) {
			const contests = jsonData.fixture_lists;
			if (Array.isArray(contests)) {
				const rawContestID = this.getRawContestID(fdContest);
				const contest = contests.find(c => c["id"] === rawContestID);
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

	private parseGame(contestData: any, gameData: any): IGame {
		return {
			awayTeam: this.parseTeam(contestData, gameData["away_team"]),
			homeTeam: this.parseTeam(contestData, gameData["home_team"]),
			startTime: new Date(gameData["start_date"])
		};
	}

	private parseTeam(contestData: any, teamData: any): ITeam {
		const teamID = teamData["team"]["_members"][0];
		const team = contestData["teams"].find(t => t["id"] === teamID);
		return {
			code: (<string>team["code"]).toUpperCase(),
			fullName: team["full_name"]
		};
	}

	parseContestPlayerList(fdContest: IContest, playerListData: string): void {
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
					player.ID = this.parsePlayerID(jsonPlayer["id"]);
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

	private parseBattingOrder(battingOrder: string): string {
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

	private parsePlayerID(id: string): string {
		const idParts = id ? id.split("-") : undefined;
		if (Array.isArray(idParts) && idParts.length === 2) {
			return idParts[1];
		}
		return id;
	}

	private parseInjuryStatus(injuryStatus: string): IPlayerInjury {
		if (utils.equalsIgnoreCase(injuryStatus, "DL") || utils.equalsIgnoreCase(injuryStatus, "IR") || utils.equalsIgnoreCase(injuryStatus, "NA") || utils.equalsIgnoreCase(injuryStatus, "O")) {
			return {
				display: injuryStatus.toUpperCase(),
				injuryType: InjuryType.Out
			};
		} else if (utils.equalsIgnoreCase(injuryStatus, "D") || utils.equalsIgnoreCase(injuryStatus, "DTD") || utils.equalsIgnoreCase(injuryStatus, "GTD") || utils.equalsIgnoreCase(injuryStatus, "Q")) {
			return {
				display: injuryStatus.toUpperCase(),
				injuryType: InjuryType.Possible
			};
		} else if (utils.equalsIgnoreCase(injuryStatus, "P")) {
			return {
				display: injuryStatus.toUpperCase(),
				injuryType: InjuryType.Probable
			};
		}
		return undefined;
	}

	private parseNewsStatus(jsonPlayer: any): NewsStatus {
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

	private attachPlayersToTeams(fdContest: IContest, players: IPlayer[]): void {
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

	private getRawContestID(contest: IContest): string {
		return contest.ID.replace(new RegExp(`^${FanDuelContestRetriever.FAN_DUEL_ID_PREFIX}`), "");
	}
}
