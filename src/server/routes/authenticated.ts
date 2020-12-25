import { Router } from "express";
import { User } from "../controllers/User";
import {
  _promisifiedPassportAuthentication,
  _promisifiedPassportLogin,
  _promisifiedPassportLogout,
} from "../passport";
import to from "await-to-js";

let router = Router();

// reject if the user is not signed in
const check = (req, res, next) => {
  if (!req.user) {
    return res.status(403).send("Please log in.");
  }
  return next();
};

// route to unlink auth accounts
router.post("/api/unlink", check, async (req, res) => {
  let user = new User(req.user);

  user.tokens[req.body.toUnlink] = undefined;

  let [err, savedUser] = await to(user.saveUser());

  if (err || !savedUser) {
    return res.status(500).send("Internal server error.");
  }

  await to(_promisifiedPassportLogin(req, savedUser));

  return res.send({
    state: { userData: req.user?.toObject() },
    msg: "Successfully unlinked!",
  });
});

router.post("/api/changePassword", check, async (req, res) => {
  let user = new User(req.user);

  let [e, matched] = await to(user.verifyPassword(req.body.oldPassword));

  if (!matched) {
    return res.status(500).send("Wrong old password!");
  }

  user.password = req.body.newPassword;

  let [err, savedUser] = await to(user.saveUser());

  if (err) {
    console.error(err);
    return res.status(500).send("Server error. Try again later.");
  }

  // no need to save new hashed password in req.user

  return res.send({ msg: "You have successfully changed your password!" });
});

// user logout route
router.post("/api/logout", async (req, res) => {
  let [err] = await to(_promisifiedPassportLogout(req));

  if (err) {
    console.error("Error : Failed to destroy the session during logout.", err);
  }
  return res.sendStatus(200);
});

export default router;
