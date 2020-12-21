import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import * as db from "./db";
import { User } from "./controllers/User";
import to from "await-to-js";

// serialize user in order to store in session in a lightweight manner
passport.serializeUser((user: User, done) => done(null, user._id));

// deserialize user back from session storage
passport.deserializeUser(async (id, done) => {
  const [err, user] = await to(db.User.findById(id).exec());
  if (err) {
    console.error(err);
  }
  return done(err, new User(user?.toObject()));
});

// LOCAL AUTH
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      const [error, fonudUser] = await to(
        db.User.findOne({
          email: email.toLowerCase(),
        }).exec()
      );

      if (error) {
        return done(error);
      }

      if (!fonudUser) {
        return done(`Email ${email} not found.`);
      }

      const user = new User(fonudUser);
      let [err, matched] = await to(user.verifyPassword(password));

      if (err) {
        return done(err);
      }

      if (matched) {
        return done(null, user);
      }

      return done("Invalid credentials.");
    }
  )
);

export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

export const isAuthorized = (req, res, next) => {
  const provider = req.path.split("/").slice(-1)[0];
  const token = req.user.tokens.find((token) => token.kind === provider);
  if (token) {
    return next();
  }

  res.redirect(`/auth/${provider}`);
};

export const _promisifiedPassportAuthentication = (req, res): Promise<User> => {
  return new Promise((resolve, reject) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return reject(err);
      }
      return resolve(user);
    })(req, res);
  });
};

export const _promisifiedPassportLogin = (
  req: Express.Request,
  user: User
): Promise<User> => {
  return new Promise((resolve, reject) => {
    req.logIn(user, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(user);
    });
  });
};

export const _promisifiedPassportLogout = (req): Promise<void> => {
  return new Promise((resolve, reject) => {
    req.logout();
    req.session.destroy((err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
};

// These can be used instead of open-authenticator. These were used in the first version of this boilerplate, at https://github.com/Scharkee/react-redux-passport-uikit-express-boiler
// If you would like to use these, you also need to re-add the routes for auth. This is all handled for you by open-authenticator.

// import { Strategy as TwitterStrategy } from "passport-twitter";
// import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
// import keysConf from "../../config/passportKeys.json";
// import { config } from "./config";;
// // TWITTER
// passport.use(
//   new TwitterStrategy(
//     {
//       consumerKey: keysConf.TWITTER_KEY,
//       consumerSecret: keysConf.TWITTER_SECRET,
//       callbackURL: `${config.url || ""}/auth/twitter/callback`,
//       passReqToCallback: true,
//     },
//     async (req, accessToken, tokenSecret, profile, done) => {
//       // checking for linked accounts
//       let [error, existingUser] = await to(
//         db.User.findOne({
//           twitter: profile.id,
//         }).exec()
//       );

//       if (error) {
//         return done(error);
//       }

//       if (existingUser) {
//         if (req.user) {
//           req.session.message = {
//             msg: "This Twitter account is already linked.",
//             error: true,
//           };

//           return done(null, false);
//         }
//         return done(null, new User(existingUser));
//       }

//       if (req.user) {
//         // linking Twitter with existing logged in account
//         let user = new User(req.user);
//         user.tokens.twitter = {
//           identity: profile.id,
//           accessToken,
//           tokenSecret,
//         };

//         // profile info, without overwriting anything
//         user.profile = user.profile || {};
//         user.profile.name = user.profile.name || profile.displayName;
//         user.profile.location = user.profile.location || profile._json.location;
//         user.profile.picture =
//           user.profile.picture || profile._json.profile_image_url_https;

//         // save user
//         let [linkError, linkedUser] = await to(user.saveUser());

//         if (linkError) {
//           return done(linkError);
//         }

//         let [err] = await to(_promisifiedPassportLogin(req, linkedUser!));

//         if (err) {
//           req.session.message = {
//             msg: "Internal server error.",
//             error: true,
//           };

//           return done(null, false);
//         }

//         // Twitter linked successfully
//         req.session.message = {
//           msg: "Twitter successfully linked!",
//           error: false,
//         };
//         return done(null, user);
//       }

//       // create new user
//       let user = new User();
//       // Twitter will not provide an email address, so we save the Twitter handle, which is unique,
//       // and produce a fake 'email':
//       user.email = `${profile.username}@twitter.com`;
//       user.tokens.twitter = {
//         identity: profile.id,
//         accessToken,
//         tokenSecret,
//       };

//       // profile
//       user.profile = user.profile || {};
//       user.profile.name = profile.displayName;
//       user.profile.location = profile._json.location;
//       user.profile.picture = profile._json.profile_image_url_https;

//       let [creationError, createdUser] = await to(user.saveUser());

//       if (creationError) {
//         req.session.message = {
//           msg: "Internal server error.",
//           error: true,
//         };

//         return done(null, false);
//       }

//       // created a new account via Twitter
//       req.session.message = {
//         msg: "Created a new account via Twitter!",
//         error: false,
//       };
//       return done(null, createdUser);
//     }
//   )
// );

// // GOOGLE
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: keysConf.GOOGLE_ID,
//       clientSecret: keysConf.GOOGLE_SECRET,
//       callbackURL: `${config.url || ""}/auth/google/callback`,
//       passReqToCallback: true,
//     },
//     async (req, accessToken, refreshToken, profile, done) => {
//       // checking for linked accounts
//       let [error, existingUser] = await to(
//         db.User.findOne({
//           google: profile.id,
//         }).exec()
//       );

//       if (error) {
//         return done(error);
//       }

//       if (existingUser) {
//         if (req.user) {
//           req.session.message = {
//             msg: "This Google account is already linked.",
//             error: true,
//           };

//           return done(null, false);
//         }

//         return done(null, new User(existingUser));
//       }

//       if (req.user) {
//         // linking Google with existing logged in account
//         let user = new User(req.user);
//         user.tokens.google = {
//           identity: profile.id,
//           accessToken,
//         };

//         // not overwriting existing profile values
//         user.profile = user.profile || {};
//         user.profile.name = user.profile.name || profile.displayName;
//         user.profile.gender = user.profile.gender || profile._json.gender;
//         user.profile.picture = user.profile.picture || profile._json.picture;

//         // save user
//         let [linkError, linkedUser] = await to(user.saveUser());

//         if (linkError) {
//           return done(linkError);
//         }

//         let [err] = await to(_promisifiedPassportLogin(req, linkedUser!));

//         if (err) {
//           req.session.message = {
//             msg: "Internal server error.",
//             error: true,
//           };

//           return done(null, false);
//         }

//         // Google linked successfully
//         req.session.message = {
//           msg: "Google successfully linked!",
//           error: false,
//         };
//         return done(null, user);
//       }

//       // create new user
//       let user = new User();
//       user.email = profile.emails[0].value;
//       user.tokens.google = {
//         identity: profile.id,
//         accessToken,
//       };
//       // initiating profile if not existent
//       user.profile = user.profile || {};
//       user.profile.name = profile.displayName;
//       user.profile.gender = profile._json.gender;
//       user.profile.picture = profile._json.picture;

//       let [creationError, createdUser] = (await to(user.saveUser())) as [
//         any,
//         User
//       ];

//       if (creationError) {
//         if (creationError.code == 11000) {
//           req.session.message = {
//             msg: "This email account is already in use!",
//             error: true,
//           };

//           return done(null, false);
//         } else {
//           req.session.message = {
//             msg: "Internal server error.",
//             error: true,
//           };

//           return done(null, false);
//         }
//       }

//       // created a new account via Google
//       req.session.message = {
//         msg: "Created a new account via Google!",
//         error: false,
//       };
//       return done(null, createdUser);
//     }
//   )
// );
