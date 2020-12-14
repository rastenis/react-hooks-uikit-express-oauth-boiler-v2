const fs = require("fs-extra");

// base values
let config = require("../config/configExample.json");

// writing and exitting
fs.writeJsonSync("./config/config.json", config);
process.exit(0);
