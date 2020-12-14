const chalk = require("chalk");
const prompt = require("prompt-sync")({ sigint: true });
const configPath = "../config/config.json";
const fs = require("fs-extra");

// base values
let config = require("../config/configExample.json");
let passportKeys = require("../config/passportKeysExample.json");

console.log(
  chalk.bgBlue.white.bold(
    "react-redux-passport-uikit-express-boiler" + new Array(9).join(" ")
  )
);
console.log(chalk.bgBlue.black(new Array(50).join(" ")));
console.log(
  chalk.bgBlue.white.bold("Starting setup..." + new Array(33).join(" "))
);

config.url = prompt(
  "Enter your website url: (http://example.com): ",
  config.url
);

config.mongooseConnectionString = prompt(
  "Enter your MongoDB connection string: (mongodb://127.0.0.1:27017/boiler): ",
  config.mongooseConnectionString
);

config.selfHosted =
  prompt(
    "Use Auto-generated TLS? (will require ports 80 and 443) (y/N): ",
    "N"
  ).toLowerCase() == "y";

if (config.selfHosted) {
  console.log(chalk.bgBlue.white("Showing additional TLS options:"));
  config.tls.email = prompt("Enter Letsencrypt email (your email): ");
  config.tls.tos =
    prompt(
      "Do you agree with the LetsEncrypt TOS? (Y/n): ",
      "Y"
    ).toLowerCase() == "y";

  if (!config.tls.tos) {
    config.selfHosted = false;
    console.log(chalk.bgBlue.white("Reverting TLS setup..."));
  } else {
    let current = 0;
    while (true) {
      config.tls.domains[current] = prompt(
        "Please enter domain " + (current + 1) + " (ENTER to cancel): "
      );
      if (config.tls.domains[current] == "") {
        config.tls.domains.splice(current, 1);
        break;
      } else {
        current++;
      }
    }
  }
}

if (!config.selfHosted) {
  console.log("NOTE:");
  console.log(
    "NOTE: dev mode (npm run dev) is accessed via a separate port that will be displayed when it is launched."
  );
  console.log(
    "NOTE: in production (npm run launch), access the server directly via the server port. "
  );
  console.log("NOTE:");
  config.port = ~~prompt("Enter production/server port (7777): ", config.port);
}

if (
  prompt(
    "Do you want to learn how to set up Google and Twitter API keys? (Y/n): ",
    "Y"
  ).toLowerCase() == "y"
) {
  console.log(chalk.bgBlue.white("Showing additional API KEY information:"));
  console.log(
    "Go to https://console.developers.google.com and create a new project. Then, create credentials for 'OAuth client ID'."
  );
  passportKeys.GOOGLE_ID = prompt("Paste the Client ID here:");
  passportKeys.GOOGLE_SECRET = prompt("Paste the Client secret here:");
  console.log(chalk.bgBlue.white("Great!"));
  console.log(
    "Now, go to https://developer.twitter.com/en/apps and create a new twitter app. Navigate to Consumer API keys."
  );
  passportKeys.TWITTER_KEY = prompt("Paste the API key here:");
  passportKeys.TWITTER_SECRET = prompt("Paste the API secret key here:");
  console.log("Passport keys configured.");
}

console.log(chalk.bgBlue.white.bold("Setup done." + new Array(39).join(" ")));
console.log(chalk.bgBlue.black(new Array(50).join(" ")));
console.log(chalk.bgBlue.white.bold("Exiting..." + new Array(40).join(" ")));

config.secret = [...Array(30)]
  .map(i => (~~(Math.random() * 36)).toString(36))
  .join("");

// key setup will be either done, or ignored, either way, saving set values/defaults
fs.writeJsonSync("./config/passportKeys.json", passportKeys);

// writing and exitting
fs.writeJsonSync("./config/config.json", config);
process.exit(0);
