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
import MongoStore from "connect-mongo";

import onlyUnauthenticatedRoutes from "./routes/notAuthenticated";
import onlyAuthenticatedRoutes from "./routes/authenticated";
import oauthRoutes from "./routes/OAuth";

import { User, User as ControllerUser } from "./controllers/User";
import { config } from "./config";

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
if (config.url.includes("https://") && !config.secure) {
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
        !config.overrideInsecureSession &&
        process.env.NODE_ENV === `production` &&
        (config.secure || config.url.includes("https://"))
          ? true
          : false,
      // 4 hours cookie expiration when secure, infinite when unsecure.
      maxAge:
        config.secure || config.url.includes("https://")
          ? Date.now() + 60 * 60 * 1000 * 4
          : undefined,
    },
    store: MongoStore.create({
      mongoUrl: config.mongooseConnectionString,
    }),
  })
);

app.use(passport.initialize(), passport.session());

// open-authenticator hook
app.use("/oauth", oauthRoutes);

// only unauthenticated users allowed
app.use("/", onlyUnauthenticatedRoutes);

// only authhenticated users allowed
app.use("/", onlyAuthenticatedRoutes);

// data fetch route (initially just a session ping to avoid localStorage, now user mock data preload has been added)
app.get("/api/data", (req, res) => {
  // processing messages

  const messages = [] as { error: boolean; msg: string }[];

  if (req.session.messages) {
    const m = req.session.messages;
    messages.push(...m);
  }

  req.session.messages = [];

  if (!req.user) {
    return res.send({
      auth: false,
      messages,
      openAuthenticatorEnabled: config.openAuthenticator?.enabled,
    });
  }

  // returning async data
  return res.send({
    auth: true,
    userData: req.user.cleanObject(),
    // mock some data
    people: Array.apply(null, Array(4)).map(() => {
      return {
        name: faker.name.findName(),
        email: faker.internet.email(),
        contact: faker.helpers.createCard(),
      };
    }),
    messages,
    openAuthenticatorEnabled: config.openAuthenticator?.enabled,
  });
});

// serving built bundle if in production
if (process.env.NODE_ENV == `production`) {
  app.use(express.static(path.resolve(__dirname, "../client")));
  app.use(express.static(path.resolve(__dirname, "../../public")));

  app.get("/", (req, res) => {
    res.sendFile(path.resolve("index.html"));
  });

  app.get("/*", (req, res) => {
    res.redirect("/");
  });
}

export default app;
