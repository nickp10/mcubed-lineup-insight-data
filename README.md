# mcubed-lineup-insight-data

Description
----
This node module will retrieve fantasy sports data. In particular, this will aggregate data such as starting players, projected points, and recent performances for daily fantasy sports sites like DraftKings, FanDuel, and Yahoo.

[mcubed-lineup-insight-data](https://github.com/nickp10/mcubed-lineup-insight-data) vs. [mcubed-lineup-insight-server](https://github.com/nickp10/mcubed-lineup-insight-server)
----
mcubed-lineup-insight-server is a node module that relies on mcubed-lineup-insight-data for all of its data. The data module is used for retrieving the fantasy sports data from third-parties. The server module is used for aggregating the data for all the current contests and merging the data from the different third-parties into the contests.

Command Line Interface
----
This node module can be run from the command line using `mcubed-lineup-insight-data -d PlayerInsight -c DraftKings -s NFL`. The arguments for the command line interface are:

* *-d / --data* - **Optional.** Specifies the type of data to retrieve. This option is case-insensitive and should be on of the [DataTypes](#DataType). If this argument is omitted, then `PlayerInsight` is used as the default value.
* *-c / --contestType* - **Required.** Specifies the contest type to retrieve the data for. This option is case-insensitive and should be one of the [ContestTypes](#ContestType).
* *-s / --sport* - **Required for PlayerInsight and TeamInsight.** Specifies the sport to retrieve the data for. This option is case-insensitive and should be one of the supported [Sports](#Sport).
* *--contestID* - **Required for PlayerCard.** Specifies the contest ID to get the player card for.
* *--playerID* - **Required for PlayerCard.** Specifies the player ID to get the player card for.

When run from the command line:
* The contest list request will produce an array of [Contests](#Contest) written as a JSON formatted string to the standard output.
* The player card request will produce a [PlayerCard](#PlayerCard) object written as a JSON formatted string to the standard output.
* The player insight request will produce an array of [Players](#Player) written as a JSON formatted string to the standard output.
* The team insight request will produce an array of [TeamInsights](#TeamInsight) written as a JSON formatted string to the standard output.

Node Module Dependency
----
This node module can be used as a dependency of another node module. Run `npm install mcubed-lineup-insight-data --save` to add it as a dependency to your node module. An example usage of the module:

```
import insightData, * as interfaces from "mcubed-lineup-insight-data";

insightData.getPlayerInsight(interfaces.ContestType.DraftKings, interfaces.Sport.NFL).then((players) => {
    players.forEach((player) => {
        console.log(player.name);
    });
});
```

Error Handling
----
Whether using this module via the Command Line Interface or as a Node Module Dependency, the error handling will be the same. All errors thrown from this module will reject the promise that is returned from the [InsightData](#InsightData) class. The errors will always be of type [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error). When running from the Command Line Interface, only the `message` property from the `Error` object will be written as a JSON formatted string to the standard error output. An example output of an error on the command line would look like:

```
{"message":"Could not retrieve data"}
```

API
----
#### <a name="InsightData"></a>InsightData
An instance of this class is returned when requiring `mcubed-lineup-insight-data` from within a node module.

* `getContestList(contestType: ContestType, sport: Sport): Promise<Contest[]>` - Returns a list of contests that are currently active for the DFS site. The `contestType` parameter is optional and should be a valid [ContestType](#ContestType) value. If no `contestType` is specified, then all contest types are returned. The `sport` parameter is optional and should be a valid [Sport](#Sport) value. If no `sport` is specified, then all sports are returned. The return value is a promise that yields an array of [Contests](#Contest).
* `getPlayerCard(contestType: ContestType, contestID: string, playerID: string): Promise<PlayerCard>` - Returns an object containing specific information about a single player for a contest. The `contestType` parameter is required and should be a valid [ContestType](#ContestType) value. The `contestID` parameter is required and should be an ID from a contest object from the `getContestList` function. The `playerID` parameter is required and should be an ID from a player object nested within a contest object from the `getContestList` function. The return value is a promise that yields a [PlayerCard](#PlayerCard).
* `getPlayerInsight(contestType: ContestType, sport: Sport): Promise<Player[]>` - Returns the data for a specified contest type and sport combination. The `contestType` parameter is required and should be a valid [ContestType](#ContestType) value. The `sport` parameter is required and should be a valid [Sport](#Sport) value. The return value is a promise that yields an array of [Players](#Player).
* `getTeamInsight(contestType: ContestType, sport: Sport): Promise<TeamInsight[]>` - Returns the team-specific data for a specified contest type and sport combination. The `contestType` parameter is required and should be a valid [ContestType](#ContestType) value. The `sport` parameter is required and should be a valid [Sport](#Sport) value. The return value is a promise that yields an array of [TeamInsights](#TeamInsight).

#### <a name="Player"></a>Player
Instances of this class are returned from calling the `getPlayerInsight` function from the [InsightData](#InsightData) object or serialized to JSON when using the command line interface.

* `battingOrder?: string` - Optionally specifies the batting order of the player for MLB contests.
* `ID?: string` - Optionally specifies a unique identifier for the player.
* `injury?: PlayerInjury` - Optionally specifies [Injury](#PlayerInjury) information for the player.
* `isProbablePitcher?: boolean` - Optionally specifies if the player is expected to be the starting pitcher for an MLB game.
* `isStarter?: boolean` - Optionally specifies if the player is in the starting lineup.
* `name: string` - Specifies the name of the player (formatted as "First Last Suffix").
* `newsStatus?: NewsStatus` - Optionally specifies the [NewsStatus](#NewsStatus) for the player.
* `position?: string` - Optionally specifies the position the player plays.
* `salary: number` - Specifies how much the player costs for the contest.
* `stats?: PlayerStats[]` - Optionally specifies an array of [PlayerStats](#PlayerStats) associated with the player.
* `team: string` - Specifies the team abbreviation the player plays for.

#### <a name="PlayerInjury"></a>PlayerInjury
Instances of this class are associated with a [Player](#Player).

* `display: string` - Specifies a display value describing the injury.
* `injuryType: InjuryType` - Specifies the [InjuryType](#InjuryType) for the player.

#### <a name="PlayerStats"></a>PlayerStats
Instances of this class are associated with a [Player](#Player).

* `source: string` - Specifies the source of which the data came from.
* `projectedCeiling?: number` - Optionally specifies the projected ceiling for the player.
* `projectedFloor?: number` - Optionally specifies the projected floor for the player.
* `projectedPoints?: number` - Optionally specifies the projected points for the player.
* `recentAveragePoints?: number` - Optionally specifies the average number of points the player has scored recently.
* `seasonAveragePoints?: number` - Optionally specifies the average number of points the player has scored on the season.

#### <a name="PlayerCard"></a>PlayerCard
Instances of this class are returned from calling the `getPlayerCard` function from the [InsightData](#InsightData) object or serialized to JSON when using the command line interface.

* `gameLog: PlayerCardGameStats[]` - Specifies an array of [PlayerCardGameStats](#PlayerCardGameStats) containing statistics for recent performances by the player.
* `news: PlayerCardArticle[]` - Specifies an array of [PlayerCardArticle](#PlayerCardArticle) containing news for the player.

#### <a name="PlayerCardArticle"></a>PlayerCardArticle
Instances of this class are associated with a [PlayerCard](#PlayerCard).

* `date: Date` - Specifies the date the news was published for the player.
* `details: string` - Specifies the full details of the news article for the player.
* `summary: string` - Specifies a summary for the news article for the player.

#### <a name="PlayerCardGameStats"></a>PlayerCardGameStats
Instances of this class are associated with a [PlayerCard](#PlayerCard).

* `date: Date` - Specifies the date of the performance by the player.
* `opponent: string` - Specifies the opponent that the performance was against. For home performances, this will be returned as "vs. OPP". For away performances, this will be returned as "@ OPP".
* `points?: number` - Optionally specifies the number of fantasy points the player received for the performance.

#### <a name="Contest"></a>Contest
Instances of this class are returned from calling the `getContestList` function from the [InsightData](#InsightData) object or serialized to JSON when using the command line interface.

* `contestType: ContestType` - Specifies the [ContestType](#ContestType).
* `games?: Game[]` - Optionally specifies an array of [Games](#Game) associated with the contest.
* `ID: string` - Specifies a unique identifier for the contest.
* `label: string` - Specifies a label describing the contest.
* `maxPlayersPerTeam?: number` - Optionally specifies the maximum number of players allowed from a single team when building a lineup.
* `maxSalary?: number` - Optionally specifies the maximum total salary allowed when building a lineup.
* `positions?: ContestPosition[]` - Optionally specifies an array of [ContestPositions](#ContestPosition) representing the positions needed to fill a lineup.
* `sport: Sport` - Specifies the [Sport](#Sport).
* `startTime?: Date` - Optionally specifies the start time for the contest.

#### <a name="ContestPosition"></a>ContestPosition
Instances of this classes are associated with a [Contest](#Contest) and represent a position needed to fulfill the contest requirements. A player may be listed for a single position, but that player may be used to fulfill any number of available positions in the contest lineup. For instance, a player listed as a RB may be eligble to fulfill a RB slot, a RB/WR/TE slot, a Util slot, an MVP slot, etc.

* `eligiblePlayerPosition: string[]` - Specifies the array of positions that may be used to fulfill the player slot. For a RB/WR/TE slot, this would be an array containing "RB", "WR", and "TE".
* `label: string` - Specifies the label that is listed on the contest for the player slot. For a RB/WR/TE slot, this would return "RB/WR/TE".

#### <a name="Game"></a>Game
Instances of this class are associated with a [Contest](#Contest) and represent a game that will be played as part of the contest.

* `awayTeam: Team` - Specifies the away [Team](#Team).
* `homeTeam: Team` - Specifies the home [Team](#Team).
* `startTime: Date` - Specifies the start time for the game.

#### <a name="Team"></a>Team
Instances of this class are associated with a [Game](#Game) and represent a team that will play as part of the contest.

* `code: string` - Specifies the team abbreviation (e.g., "BOS").
* `fullName: Team` - Specifies the full team name (e.g., "Boston Red Sox").
* `players?: Player[]` - Optionally specifies an array of [Players](#Player) that are on the team.

#### <a name="TeamInsight"></a>TeamInsight
Instances of this class are returned from calling the `getTeamInsight` function from the [InsightData](#InsightData) object or serialized to JSON when using the command line interface.

* `code: string` - Specifies the team abbreviation (e.g., "BOS").
* `fullName: Team` - Specifies the full team name (e.g., "Boston Red Sox").
* `pointsAllowedPerPosition?: PositionPoints[]` - Optionally specifies an array of [PositionPoints](#PositionPoints) representing the fantasy points allowed to a particular position.

#### <a name="PositionPoints></a>PositionPoints
Instances of this class are associated with a [TeamInsight](#TeamInsight) and represents the number of fantasy points allowed to the opposing position. For MLB, instead of basing it on the opposing position, it is based on the opposing hitters' handedness. Therefore, the position would be one of `R` (right handers), `L` (left handers), or `S` (switch hitters).

* `position: string` - Specifies the position the points were allowed to (e.g., "QB", "RB", "PG", "SF"). For MLB, specifies the handedness of the hitters the points were allowed to (e.g., "R", "L", "S").
* `points: number` - Specifies the number of fantasy points allowed to the position.

#### <a name="ContestType"></a>ContestType
Defines an enumerated list of valid contest types. A contest type represents a DFS site.

* `DraftKings`
* `FanDuel`
* `Yahoo`

#### <a name="DataType"></a>DataType
Defines an enumerated list of valid data types. A data type represents information that may be retrieved from this module.

* `ContestList` - Used to retrieve a list of contests.
* `PlayerCard` - Used to retrieve detailed information about a specific player.
* `PlayerInsight` - Used to retrieve projected points and other general information about all players.
* `TeamInsight` - Used to retrieve general information about all teams.

#### <a name="InjuryType"></a>InjuryType
Defines an enumerated list of valid injury types. An injury type represents the likelihood that the player will play with the injury.

* `Out`
* `Possible`
* `Probable`

#### <a name="NewsStatus"></a>NewsStatus
Defines an enumerated list of valid news statuses. A news status represents the freshness of news on a player.

* `Breaking`
* `Recent`
* `None`

#### <a name="Sport"></a>Sport
Defines an enumerated list of valid sports supported by this module.

* `MLB`
* `NBA`
* `NFL`
* `NHL`

Developer Setup
----
1. Use `git clone` to clone the GitHub repository
1. In the root directory of the module, run: `npm install`

Versioning
----
This package will follow the semantic versioning (X.X.X) and will be updated as such:

* Major releases or changes that will break the API will increment the first number. This will include renaming properties or otherwise refactoring the API.
* New features that do not break the API will increment the middle number. This will include adding contest sites, data retrievers, sports, and additional data.
* Bug fixes and minor changes will increment the last number. This will include maintenance efforts for the current set of contest sites, data retrievers, and sports.

Usage Notice
----
This node module does not formulate any of its own data. It aggregates the data formulated by third-party fantasy sports data providers. All data collected by this node module is freely available without the use of any premium subscriptions. Not all third-party providers provide data for each contest type or sport. This node module will provide the information that it can get and will correlate the data to the third-party data provider it came from. All attribution of any data that is used from this node module should be attributed to the third-party data providers.

Attribution
----
Thanks to the following third-parties for providing the data that makes this node module possible:

* [DraftKings](https://www.draftkings.com)
* [FanDuel](https://www.fanduel.com)
* [Yahoo](https://sports.yahoo.com/dailyfantasy/)
* [Daily Fantasy Sports Rankings](https://www.dailyfantasysportsrankings.com/)
* [NumberFire](https://www.numberfire.com/)
* [RotoGrinders](https://www.rotogrinders.com/)
* [RotoWire](http://www.rotowire.com/)
