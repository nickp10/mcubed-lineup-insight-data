# mcubed-lineup-insight-data

Description
----
This node module will retrieve fantasy sports data. In particular, this will aggregate data such as starting players, projected points, and recent performances for daily fantasy sports sites like DraftKings, FanDuel, and Yahoo.

How To Use
----
_NOTE: This node module is meant to be used as a dependency of another node module._

1. Install Node.js
	* Manual install: http://www.nodejs.org
	* Chocolatey (for Windows): `choco install nodejs.install`
2. Create a node module (if you do not have a node module to use already)
	* From an empty directory, run: `npm init -y`
3. Install the module by running: `npm install mcubed-lineup-insight-data --save`

Developer Setup
----
1. Install Node.js
	* Manual install: http://www.nodejs.org
	* Chocolatey (for Windows): `choco install nodejs.install`
1. Use `git clone` to clone this repository
1. In the root directory of the module, run: `npm install`

Versioning
----
This package will follow the semantic versioning (X.X.X) and will be updated as such:

* Bug fixes and minor changes will increment the last number. This will include maintenance efforts for the current set of contest sites, data retrievers, and sports.
* New features that do not break the API will increment the middle number. This will include adding contest sites, data retrievers, sports, and additional data.
* Major releases or changes that will break the API will increment the first number. This will include renaming properties or otherwise refactoring the API.

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
