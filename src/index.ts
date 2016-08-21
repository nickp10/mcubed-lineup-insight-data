import Data = require("./data");

new Data().getData("fanDuel", "mlb").then((players) => {
	console.log(JSON.stringify(players));
});
