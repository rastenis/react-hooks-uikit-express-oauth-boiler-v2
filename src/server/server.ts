import express from "express";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import {
  _promisifiedPassportAuthentication,
  _promisifiedPassportLogin,
  _promisifiedPassportLogout,
} from "./passport";
import path from "path";
import bodyParser from "body-parser";
import session from "express-session";
import mongoose from "mongoose";
import faker from "faker";
import mongoStore from "connect-mongo";

import config from "../../config/config.json";
import onlyUnAuth from "./routes/unAuth";
import onlyAuth from "./routes/auth";
import { User, User as ControllerUser } from "./controllers/User";

const MongoStore = mongoStore(session);
const app = express();

// extending the session object for our uses.
// This may be moved into typings
declare module "express-session" {
  interface Session {
    user?: User;
    returnTo?: string;
    messages?: {
      msg: string;
      error: boolean;
    }[];
  }
}

declare global {
  namespace Express {
    interface User extends ControllerUser {}
  }
}

// proxy providing tls (override)
if (config.url.includes("https") && !config.selfHosted) {
  app.set("trust proxy", 1);
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(
  session({
    name: "boilerSessionId",
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure:
        process.env.NODE_ENV == `production` &&
        (config.selfHosted || config.url.includes("https"))
          ? true
          : false,
      // 4 hours cookie expiration when secure, infinite when unsecure.
      maxAge:
        config.selfHosted || config.url.includes("https")
          ? Date.now() + 60 * 60 * 1000 * 4
          : undefined,
      domain:
        process.env.NODE_ENV == `production`
          ? config.url.replace(/http:\/\/|https:\/\//g, "")
          : "",
    },
    store: new MongoStore({
      mongooseConnection: mongoose.createConnection(
        config.mongooseConnectionString
      ),
    }),
  })
);

app.use(passport.initialize(), passport.session());

// only unauthenticated users allowed
app.use("/", onlyUnAuth);

// only authhenticated users allowed
app.use("/", onlyAuth);

// router.get("/strategy/:strategy", checkSetup, (req, res) => {
//   return res.redirect(
//     `${process.env.PROTOCOL}://${
//       process.env.AUTHENTICATORDOMAIN
//     }/initiate?client_id=${
//       config.authenticator?.client ?? "controls"
//     }&strategy=${req.params.strategy}&redirect_uri=${process.env.PROTOCOL}://${
//       process.env.DOMAIN
//     }/api/oauth/callback`
//   );
// });

// router.get("/strategies", async (req, res) => {
//   if (!process.env.AUTHENTICATORDOMAIN) {
//     return res.json([]);
//   }

//   const strats = await axios.get(
//     `${process.env.PROTOCOL}://${process.env.AUTHENTICATORDOMAIN}/strategies`,
//     { timeout: 5000 }
//   );

//   return res.json(strats.data);
// });

// data fetch route (initially just a session ping to avoid localStorage, now user mock data preload has been added)
app.get("/api/data", (req, res) => {
  // processing messages

  const messages = [] as { error: boolean; msg: string }[];

  if (req.session.messages) {
    const m = Object.assign([], req.session.messages);
    messages.push(...m);
  }

  req.session.messages = [];

  if (!req.user) {
    return res.send({
      auth: false,
      messages,
    });
  }

  // returning async data
  return res.send({
    auth: true,
    userData: {
      ...req.user.toObject(),
      password: req.user.password ? "<password>" : null, // this is to avoid leaking the password hash.
    },
    // mock some data
    people: Array.apply(null, Array(4)).map(() => {
      return {
        name: faker.name.findName(),
        email: faker.internet.email(),
        contact: faker.helpers.createCard(),
      };
    }),
    messages,
  });
});

// serving built bundle if in production
if (process.env.NODE_ENV == `production`) {
  console.log(path.resolve(__dirname, "../../../client"));
  app.use(express.static(path.resolve(__dirname, "../../../client")));
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve("index.html"));
  });
}

export default app;
