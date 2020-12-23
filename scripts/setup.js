("use strict");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const to = require("await-to-js").default;
const chalk = require("chalk");

console.log(
  chalk.bgBlue.white.bold(
    "react-hooks-uikit-express-oauth-boiler-v2" + new Array(9).join(" ")
  )
);
console.log(chalk.bgBlue.black(new Array(50).join(" ")));
console.log(
  chalk.bgBlue.white.bold("Starting setup..." + new Array(33).join(" "))
);

(async () => {
  let [configError, config] = await to(
    fs.readJson("./config/configExample.json")
  );

  if (configError) {
    console.error(
      "Could not read template configuration. It should be present in config/configExample.json."
    );
    process.exit(0);
  }

  const initialPrompt = await inquirer.prompt([
    {
      type: "confirm",
      message: `Would you like to run in composition mode? (Easy setup for OAuth logins via open-authenticator)`,
      default: true,
      name: "useComposition",
    },
  ]);

  let prompt;
  if (initialPrompt.useComposition) {
    prompt = await inquirer.prompt([
      {
        type: "input",
        message: `Enter the boilerplate URL that will point to this IP:`,
        name: "url",
        default: "https://domain.com",
      },
      {
        type: "input",
        message: `Enter the open-authenticator URL that will also point to this IP:`,
        name: "openAuthenticatorUrl",
        default: "https://auth.domain.com",
      },
      {
        type: "input",
        message: `Enter your mongo connection string (use default for composition):`,
        default: "mongodb://mongo:27017/boiler",
        name: "mongoUrl",
      },
      {
        type: "confirm",
        message: `Would you like to use secure sessions ? (you must if you are using https)`,
        default: true,
        name: "sessionSecure",
      },
      {
        type: "input",
        message: `What is the open-authenticator client name for this boilerplate?:`,
        default: "boiler",
        name: "client",
      },
    ]);
  } else {
    prompt = await inquirer.prompt([
      {
        type: "input",
        message: `Enter the boilerplate URL that will point to this IP: (does not matter if just running locally)`,
        name: "url",
        default: "https://domain.com",
      },
      {
        type: "number",
        message: `Enter production port: (yarn launch. For yarn dev it is 8080)`,
        name: "port",
        default: 80,
      },
      {
        type: "input",
        message: `Enter your mongo connection string (use default for composition):`,
        default: "mongodb://mongo:27017/boiler",
        name: "mongoUrl",
      },
      {
        type: "confirm",
        message: `Would you like to use secure sessions ? (you must if you are using https)`,
        default: true,
        name: "sessionSecure",
      },
    ]);
  }

  config.port = prompt.port;
  config.secure = prompt.sessionSecure;
  config.url = prompt.url;
  config.mongooseConnectionString = prompt.mongoUrl;

  if (initialPrompt.useComposition) {
    config.openAuthenticator.enabled = true;
    config.openAuthenticator.client = prompt.client;
    config.openAuthenticator.url = prompt.openAuthenticatorUrl;
  }

  // Random session secret gen.
  config.secret = [...Array(30)]
    .map((i) => (~~(Math.random() * 36)).toString(36))
    .join("");

  console.log("Writing config...");
  await fs.writeJSON("./config/config.json", config);

  console.log(chalk.bgBlue.white.bold("Setup done." + new Array(39).join(" ")));
  console.log(chalk.bgBlue.black(new Array(50).join(" ")));
  console.log(chalk.bgBlue.white.bold("Exiting..." + new Array(40).join(" ")));

  if (initialPrompt.useComposition) {
    console.log(
      `Run ${chalk.cyan.bold(
        "docker exec -it authenticator yarn run config"
      )} if you want to set up open-authenticator and the OAuth strategies.`
    );
  } else {
    console.log(
      `You can re-run this later if you would like to setup OAuth logins (Google, Twitter, etc.) via open-authenticator.`
    );
  }

  process.exit(0);
})();
