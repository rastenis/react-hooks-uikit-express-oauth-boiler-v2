("use strict");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const to = require("await-to-js").default;
const chalk = require("chalk");
const exec = require("child_process").exec;

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
        default: "domain.com",
      },
      {
        type: "input",
        message: `Enter the open-authenticator URL that will also point to this IP:`,
        name: "openAuthenticatorUrl",
        default: "auth.domain.com",
      },
      {
        type: "input",
        message: `What is the open-authenticator client name for this boilerplate? (You will have to enter this in the open-authenticator setup!):`,
        default: "boiler",
        name: "client",
      },
      {
        type: "input",
        message: `Email for LetsEncrypt certificate generation (any email):`,
        default: "someemail@mail.com",
        name: "letsencryptEmail",
      },
    ]);

    console.log(
      "By continuing, you are accepting Lets Encrypt Terms of Service: https://letsencrypt.org/repository/"
    );

    console.log("Injecting values into docker-compose.yml...");

    // injecting docker compose values
    exec(
      `sed -i "s/BOILER_DOMAIN:.*/BOILER_DOMAIN: ${prompt.url}/g" ./docker-compose.yml`
    );
    exec(
      `sed -i "s/OPENAUTHENTICATOR_DOMAIN:.*/OPENAUTHENTICATOR_DOMAIN: ${prompt.openAuthenticatorUrl}/g" ./docker-compose.yml`
    );
    exec(
      `sed -i "s/CERTBOT_EMAIL:.*/CERTBOT_EMAIL: ${prompt.letsencryptEmail}/g" ./docker-compose.yml`
    );

    // Standardizing
    prompt.url = "https://" + prompt.url;
    prompt.mongoUrl = "mongodb://mongo:27017/boiler";
    prompt.sessionSecure = false; // This means insecure from boiler to nginx, which is what we want - secure sessions will be used in production with a 1-gap trust proxy for nginx.
    prompt.port = 80;

    // Openauthenticator config
    config.openAuthenticator.enabled = true;
    config.openAuthenticator.client = prompt.client;
    config.openAuthenticator.url = "https://" + prompt.openAuthenticatorUrl;
  } else {
    prompt = await inquirer.prompt([
      {
        type: "input",
        message: `Enter the boilerplate URL + protocol that will point to this IP: (does not matter if just running locally)`,
        name: "url",
        default: "https://domain.com",
      },
      {
        type: "number",
        message: `Enter production port: (this is for 'yarn launch'. For 'yarn dev' it is 8080)`,
        name: "port",
        default: 80,
      },
      {
        type: "input",
        message: `Enter your mongo connection string:`,
        default: "mongodb://localhost:27017/boiler",
        name: "mongoUrl",
      },
      {
        type: "confirm",
        message: `Would you like to use secure sessions ? (advised, but only works under https)`,
        default: false,
        name: "sessionSecure",
      },
    ]);

    if (!prompt.sessionSecure && prompt.url.includes("https://")) {
      console.info(
        "Please note, since you are using a HTTPS domain and picked insecure sessions, I am assuming you are using a reverse HTTP proxy (nginx/apache) for providing TLS certificates. Thus, sessions will still be secure, but your reverse proxy will be assumed secure by Node. If this is NOT what you want, please set config.overrideInsecureSession=true (keep in mind, insecure sessions should NOT be used in production)."
      );
    }
  }

  config.port = prompt.port;
  config.secure = prompt.sessionSecure;
  config.url = prompt.url;
  config.mongooseConnectionString = prompt.mongoUrl;

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
        "docker exec -it authenticator yarn setup"
      )} if you want to set up open-authenticator and the OAuth strategies.`
    );
  } else {
    console.log(
      `You can re-run this later if you would like to setup OAuth logins (Google, Twitter, etc.) via open-authenticator.`
    );
  }

  process.exit(0);
})();
