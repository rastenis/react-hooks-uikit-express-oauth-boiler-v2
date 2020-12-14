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
import { User } from "./controllers/user";

const MongoStore = mongoStore(session);
const app = express();

// extending the session object for our uses.
// This may be moved into typings
declare module "express-session" {
  interface Session {
    user?: User;
    returnTo?: string;
    message?: {
      msg: string;
      error: boolean;
    };
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

// passportjs auth + callback routes
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: "profile email",
  })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect(req.session.returnTo || "/");
  }
);
app.get("/auth/twitter", passport.authenticate("twitter"));
app.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect(req.session.returnTo || "/");
  }
);

// data fetch route (initially just a session ping to avoid localStorage, now user mock data preload has been added)
app.get("/api/data", (req, res) => {
  // processing messages
  let m = Object.assign({}, req.session.message);
  delete req.session.message;

  if (!req.session.user) {
    return res.send({ auth: false, message: m });
  }

  // returning async data
  return res.send({
    auth: true,
    state: {
      userData: req.session.user.data,
      // mock 'static' data
      people: Array.apply(null, Array(4)).map(() => {
        return {
          name: faker.name.findName(),
          email: faker.internet.email(),
          contact: faker.helpers.createCard(),
        };
      }),
    },
    message: m,
  });
});

// serving built bundle if in production
if (process.env.NODE_ENV == `production`) {
  app.use(express.static(path.resolve(__dirname, "../../dist")));
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve("index.html"));
  });
}

export default app;
