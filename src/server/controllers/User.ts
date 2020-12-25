import bcrypt from "bcrypt";
import { User as UserModel, IUser } from "../db";
import to from "await-to-js";

const SALT_ROUDS = 10;

export class User extends UserModel {
  /**
   * Creates a new user object with an override for isNew, if a doc was passed in (by default in mongoose any model construction produces a 'new' database object)
   */
  constructor(doc?, isNew?: boolean) {
    super(doc);
    if (doc) {
      this.isNew = isNew ?? false;
    }
  }

  /**
   * Password verification
   */
  async verifyPassword(candidate) {
    return bcrypt.compare(candidate, this.password);
  }

  /**
   * Mongoose save-time hashing
   */
  static async ensurePasswordHashed(user: IUser): Promise<string> {
    if (!user.password || User.isHashed(user.password)) {
      return user?.password;
    }

    const salt = await bcrypt.genSalt(SALT_ROUDS);
    const hash = await bcrypt.hash(user.password, salt);
    return hash;
  }

  /**
   * Checks if password is hashed, or needs hashing.
   */
  static isHashed(password) {
    if (!password) return false;
    return password.split("$").length == 4;
  }

  /**
   * Creates new or updates existing user.
   */
  async saveUser() {
    await this.save();
    return this;
  }

  /**
   * Returns a clean user object, for clientside storage.
   */
  cleanObject() {
    return {
      ...this.toObject(),
      password: this.password ? "<password>" : null, // this is to avoid leaking the password hash.
    };
  }

  /**
   * Deletes this user.
   */
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
