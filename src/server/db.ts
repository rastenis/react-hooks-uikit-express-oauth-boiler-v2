import mongoose from "mongoose";
import config from "../../config/config.json";

const userSchema = new mongoose.Schema({
  email: {
    unique: true,
    type: String,
  },
  password: String,
  tokens: [],
  profile: {},
  google: String,
  twitter: String,
});

const User = mongoose.model("User", userSchema, "users");

mongoose.connect(config.mongooseConnectionString, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = {
  User: User,
};

export default db;
