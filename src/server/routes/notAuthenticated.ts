import { Router } from "express";
import { User } from "../controllers/User";
import {
  _promisifiedPassportAuthentication,
  _promisifiedPassportLogin,
  _promisifiedPassportLogout,
} from "../passport";
import to from "await-to-js";

let router = Router();

// reject if the user is signed in already
const check = (req, res, next) => {
  if (req.user) {
    return res.status(500).send("You are already signed in!");
  }
  return next();
};

router.post("/api/login", check, async (req, res) => {
  console.log(`LOGIN | requester: ${req.body.email}`);

  let [err, user] = await to(_promisifiedPassportAuthentication(req, res));

  if (err) {
    console.error(err);
    return res.status(401).send("Wrong credentials!");
  }
  if (!user) {
    // all failed logins default to the same error message
    return res.status(401).send("Wrong credentials!");
  }

  [err] = await to(_promisifiedPassportLogin(req, user));

  if (err) {
    console.error(err);
    return res.status(500).send("Authentication error!");
  }

  return res.send({
    msg: "You have successfully logged in!",
    state: { profile: { ...user.profile, id: user._id } },
  });
});

router.post("/api/register", check, async (req, res) => {
  console.log(`REGISTRATION | requester: ${req.body.email}`);

  // mirrored validation checks
  if (!/\S+@\S+\.\S+/.test(req.body.email)) {
    return res.status(500).send("Enter a valid email address.");
  } else if (req.body.password.length < 5 || req.body.password.length > 100) {
    // arbitrary
    return res
      .status(500)
      .send("Password must be between 5 and a 100 characters.");
  }

  const duplicateEmail = await User.exists({ email: req.body.email });

  if (duplicateEmail) {
    return res.status(500).send("User with given email already exists!");
  }

  let [err, user] = (await to(new User(req.body, true).saveUser())) as [
    any,
    User
  ];

  if (err) {
    // This was used before, but if you are accepting OAuth registrations without an email, null emails will collide.
    if (err.code == 11000) {
      return res.status(500).send("User with given email already exists!");
    } else {
      console.error(err);
      return res.status(500).send("Server error. Try again later.");
    }
  }

  [err] = await to(_promisifiedPassportLogin(req, user));

  if (err) {
    console.error(err);
    return res.status(500).send("Authentication error!");
  }
  return res.send({
    msg: "You have successfully registered!",
    state: { profile: { ...user.profile, id: user._id } },
  });
});

export default router;
