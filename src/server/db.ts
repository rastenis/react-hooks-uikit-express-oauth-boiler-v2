import mongoose from "mongoose";
import { config } from "./config";
import { User as UserController } from "./controllers/User";

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  tokens: {},
  profile: {},
});

userSchema.pre("save", async function (next) {
  let thisDoc = <IUser>this;
  thisDoc.password = await UserController.ensurePasswordHashed(thisDoc);
  next();
});

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  tokens: {
    [platform: string]:
      | { identity: string; [additionalKey: string]: any }
      | undefined;
  };
  profile: any;
}

export const User = mongoose.model<IUser>("User", userSchema, "users");

mongoose.connect(config.mongooseConnectionString, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
