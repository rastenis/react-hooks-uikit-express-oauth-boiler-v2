import express from "express";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import {
  _promisifiedPassportAuthentication,
  _promisifiedPassportLogin,
  _promisifiedPassportLogout,
} from "./passport";

import { config } from "./config";
import axios from "axios";
import { User } from "./controllers/User";
import to from "await-to-js";
import * as db from "./db";

const router = express.Router();

export function checkSetup(req, res, next) {
  if (!process.env.AUTHENTICATORDOMAIN) {
    throw new Error(
      "Open-authenticator is not set up! You can not access OAuth routes."
    );
  }
  next();
}

router.get("/strategy/:strategy", checkSetup, (req, res) => {
  return res.redirect(
    `${config.url}/initiate?client_id=${
      config.openAuthenticator ?? "boiler"
    }&strategy=${req.params.strategy}&redirect_uri=${
      config.url
    }/api/oauth/callback`
  );
});

router.get("/strategies", async (req, res) => {
  if (!process.env.AUTHENTICATORDOMAIN) {
    return res.json([]);
  }

  const strats = await axios.get(
    `${process.env.PROTOCOL}://${process.env.AUTHENTICATORDOMAIN}/strategies`,
    { timeout: 5000 }
  );

  return res.json(strats.data);
});

router.get("/callback", async (req, res) => {
  if (!req.session) {
    throw new Error("Failed to attach on non-existent session.");
  }

  // initializing messages
  if (!req.session.messages) {
    req.session.messages = [];
  }

  if (!req.query.code) {
    req.session.messages.push({
      error: true,
      msg: "Authenitcation failed! No code returned.",
    });
    return res.redirect("/");
  }

  // verifying...
  const verif = await axios.post(`${config.url}/verify`, {
    code: req.query.code,
  });

  // IF the user is already logged in, we attach the strategy.
  if (req.user) {
    // Attach to user.
    let user = new User(req.user);
    if (!user) {
      throw "Non-existent user attached to session. Inconsistent state!";
    }

    user.tokens[verif.data.strategy] = verif.data.identity;
    user.markModified("tokens");
    user = await user.save();
    req.user = user;

    req.session.messages.push({
      msg: `You have linked ${verif.data.strategy}!`,
      error: false,
    });
    return res.redirect("/");
  }

  const strategyFormatted =
    verif.data.strategy[0].toUpperCase() + verif.data.strategy.slice(1);

  // TODO: switch to .emails?
  let foundUser = await db.User.findOne({
    [`tokens.${verif.data.strategy}`]: verif.data.identity,
  }).exec();

  // No user found. Create new user.
  if (!foundUser) {
    req.session.messages.push({
      error: true,
      msg: "No user with these credentials!",
    });
    return res.redirect("/");
  }

  console.log(`${foundUser.email} logged in via OAuth - ${strategyFormatted}.`);

  const [err] = await to(_promisifiedPassportLogin(req, new User(foundUser)));

  if (err) {
    console.error(err);
    return res.status(500).send("Authentication error!");
  }

  req.session.messages.push({
    error: false,
    msg: `You have logged in via ${strategyFormatted}!`,
  });

  return res.redirect("/");
});
