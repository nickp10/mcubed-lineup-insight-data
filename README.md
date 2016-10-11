# mcubed-lineup-insight-data

Description
----
This node module will retrieve fantasy sports data. In particular, this will aggregate data such as starting players, projected points, and recent performances for daily fantasy sports sites like DraftKings, FanDuel, and Yahoo.

Command Line
----
This node module can be run from the command line using `mcubed-lineup-insight-data -c DraftKings -s NFL`. The arguments for the command are:

* *-c / --contestType* **Required.** Specifies the contest type to retrieve the data for. This option is case-insensitive and should be one of the following: DraftKings, FanDuel, or Yahoo.
* *-s / --sportType* **Required.** Specifies the sport to retreive the data for. This option is case-insensitive and should be one of the following: MLB, NBA, NFL, or NHL.

When run from the command line, an array of [Players](#Player) will be written as a JSON formatted string to the standard output.

Node Module Dependency
----
This node module can be used a dependency of another node module. Run `npm install mcubed-lineup-insight-data --save` to add it as a dependency to your node module. An example usage of the module:

```
var insight = require("mcubed-lineup-insight-data");

insight.getData("DraftKings", "NFL").then((players) => {
    players.forEach((player) => {
        console.log(player.name);
    });
});
```

API
----
#### <a name="InsightData"></a>InsightData
An instance of this class is returned when requiring `mcubed-lineup-insight-data` from within a node module.

`getData(contestType: string, sport: string): IThenable<Player[]>` - Returns the data for a specified contest type and sport combination. The `contestType` should be DraftKings, FanDuel, or Yahoo and is case-insensitive. The `sport` should be MLB, NBA, NFL, or NHl and is case-insensitive. The return value is a promise that yields an of [Players](#Player).

#### <a name="Player"></a>Player
Instances of this class are returned from calling the `getData` function from the [InsightData](#InsightData) object or de-serialized to JSON when using the command line interface.

`battingOrder?: string` - Optionally specifies the batting order of the player for MLB contests.

`isStarter?: boolean` - Optionally specifies if the player is in the starting lineup.

`name: string` - Specifies the name of the player (formatted as "First Last Suffix").

`team: string` - Specifies the team abbreviation the player plays for.

`stats: PlayerStats[]` - Specifies an array of [PlayerStats](#PlayerStats) associated with the player.

#### <a name="PlayerStats"></a>PlayerStats
Instances of this class are associated with a [Player](#Player).

`source: string` - Specifies the source of which the data came from.

`projectedCeiling?: number` - Optionally specifies the projected ceiling for the player.

`projectedFloor?: number` - Optionally specifies the projected floor for the player.

`projectedPoints?: number` - Optionally specifies the projected points for the player.

`recentAveragePoints?: number` - Optionally specifies the average number of points the player has scored recently.

`seasonAveragePoints?: number` - Optionally specifies the average number of poitns the player has scored on the season.

Developer Setup
----
1. Use `git clone` to clone the GitHub repository
1. In the root directory of the module, run: `npm install`

Versioning
----
This package will follow the semantic versioning (X.X.X) and will be updated as such:

* Bug fixes and minor changes will increment the last number. This will include maintenance efforts for the current set of contest sites, data retrievers, and sports.
* New features that do not break the API will increment the middle number. This will include adding contest sites, data retrievers, sports, and additional data.
* Major releases or changes that will break the API will increment the first number. This will include renaming properties or otherwise refactoring the API.

Usage Notice
----
This node module does not formulate any of its own data. It aggregates the data formulated by third-party fantasy sports data providers. All data collected by this node module is freely available without the use of any premium subscriptions. Not all third-party providers provide data for each contest type or sport. This node module will provide the information that it can get and will correlate the data to the third-party data provider it came from. All attribution of any data that is used from this node module should be attributed to the third-party data providers.

Attribution
----
Thanks to the following websites for providing the data that makes this node module possible:

* [DraftKings](https://www.draftkings.com)
* [FanDuel](https://www.fanduel.com)
* [Yahoo](https://sports.yahoo.com/dailyfantasy/)
* [Daily Fantasy Sports Rankings](https://www.dailyfantasysportsrankings.com/)
* [NumberFire](https://www.numberfire.com/)
* [RotoGrinders](https://www.rotogrinders.com/)
* [RotoWire](http://www.rotowire.com/)
