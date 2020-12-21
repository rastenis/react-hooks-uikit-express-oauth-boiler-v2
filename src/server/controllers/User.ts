import bcrypt from "bcrypt";
import { User as UserModel, IUser } from "../db";
import to from "await-to-js";

const SALT_ROUDS = 10;

export class User extends UserModel {
  constructor(doc?, isNew?: boolean) {
    super(doc);
    if (doc) {
      this.isNew = isNew ?? false;
    }
  }

  async verifyPassword(candidate) {
    return bcrypt.compare(candidate, this.password);
  }

  // Mongoose save-time hashing
  static async ensurePasswordHashed(user: IUser): Promise<string> {
    if (!user.password || User.isHashed(user.password)) {
      return user?.password;
    }

    const salt = await bcrypt.genSalt(SALT_ROUDS);
    const hash = await bcrypt.hash(user.password, salt);
    return hash;
  }

  static isHashed(password) {
    if (!password) return false;
    return password.split("$").length == 4;
  }

  async saveUser() {
    await this.save();
    return this;
  }

  async deleteUser() {
    const [err] = await to(
      User.deleteOne({
        _id: this._id,
      }).exec()
    );

    if (err) {
      throw err;
    }
    return;
  }
}
