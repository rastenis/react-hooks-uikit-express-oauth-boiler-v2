import express from "express";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import {
  _promisifiedPassportAuthentication,
  _promisifiedPassportLogin,
  _promisifiedPassportLogout,
} from "../passport";

import { config } from "../config";
import axios from "axios";
import { User } from "../controllers/User";
import to from "await-to-js";
import * as db from "../db";

const router = express.Router();

export default router;

export function checkSetup(req, res, next) {
  if (!config.openAuthenticator?.enabled) {
    throw new Error(
      "open-authenticator is not set up! You can not access OAuth routes."
    );
  }
  next();
}

// For all routes below.
router.use(checkSetup);

// Login via OR link
router.get("/strategy/:strategy", (req, res) => {
  return res.redirect(
    `${config.openAuthenticator.url}/initiate?client_id=${
      config.openAuthenticator.client ?? "boiler"
    }&strategy=${req.params.strategy}&redirect_uri=${config.url}/oauth/callback`
  );
});

// Unlink
router.delete("/strategy/:strategy", async (req, res) => {
  if (!req.session || !req.user) {
    throw new Error("Failed to unlink OAuth strategy on non-existent session.");
  }

  if (typeof req.params.strategy !== "string") {
    throw new Error("Invalid submission.");
  }

  // Do the unlink.
  let user = new User(req.user);
  if (!user) {
    throw "Non-existent user attached to session. Inconsistent state!";
  }

  if (!user.tokens?.[req.params.strategy]) {
    throw new Error(req.params.strategy + " is not linked!");
  }

  delete user.tokens[req.params.strategy];
  user.markModified("tokens");
  user = await user.save();
  await to(_promisifiedPassportLogin(req, user)); // update user object

  return res.json({
    error: false,
    msg: `You have unlinked ${req.params.strategy}!`,
    userData: user.cleanObject(),
  });
});

router.get("/strategies", async (req, res) => {
  if (!config.openAuthenticator?.enabled || !config.openAuthenticator?.url) {
    return res.json([]);
  }

  const strats = await axios.get(`${config.openAuthenticator.url}/strategies`, {
    timeout: 5000,
  });

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
  const verif = await axios.post(`${config.openAuthenticator.url}/verify`, {
    code: req.query.code,
  });

  // IF the user is already logged in, we attach the strategy.
  if (req.user) {
    // Attach to user.
    let user = new User(req.user);
    if (!user) {
      throw "Non-existent user attached to session. Inconsistent state!";
    }

    if (!user.tokens) {
      user.tokens = {} as any;
    }

    user.tokens[verif.data.strategy] = verif.data.identity;
    user.markModified("tokens");
    user = await user.save();
    await to(_promisifiedPassportLogin(req, user)); // update user object

    req.session.messages.push({
      msg: `You have linked ${verif.data.strategy}!`,
      error: false,
    });
    return res.redirect("/");
  }

  const strategyFormatted =
    verif.data.strategy[0].toUpperCase() + verif.data.strategy.slice(1);

  let foundUser = await db.User.findOne({
    [`tokens.${verif.data.strategy}`]: verif.data.identity,
  }).exec();

  let user;

  // No user found. Create new user.
  if (!foundUser) {
    user = new User(
      { tokens: { [verif.data.strategy]: verif.data.identity } },
      true
    );

    await user.saveUser();

    req.session.messages.push({
      error: false,
      msg: `You have created an account via ${strategyFormatted}!`,
    });
  } else {
    user = new User(foundUser);
  }

  console.log(
    `${
      user.email ?? user.tokens[verif.data.strategy]
    } logged in via OAuth - ${strategyFormatted}.`
  );

  const [err] = await to(_promisifiedPassportLogin(req, user));

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
