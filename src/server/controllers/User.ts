import bcrypt from "bcrypt";
import db from "../db";
import to from "await-to-js";

const SALT_ROUDS = 10;

export class User {
  _meta: any;
  data: any;

  constructor(data?) {
    if (!data?._id) {
      this.data = {
        tokens: [],
        profile: {},
        ...data,
      };

      this._meta = {
        new: true,
      };
    } else {
      this.data = data;

      if (!Array.isArray(this.data.tokens)) {
        this.data.tokens = [];
      }

      if (!this.data.profile) {
        this.data.profile = {};
      }

      this._meta = {
        new: false,
      };
    }
  }

  async verifyPassword(candidate) {
    return bcrypt.compare(candidate, this.data.password);
  }

  async hashPassword(password) {
    if (!password || this._meta.noPassword) {
      return null;
    }
    let salt = await bcrypt.genSalt(SALT_ROUDS);
    let hash = await bcrypt.hash(password, salt);
    return hash;
  }

  isHashed(password) {
    if (!password) return false;
    return password.split("$").length == 4;
  }

  async saveUser() {
    if (this._meta.new) {
      // generating hashed password
      let hashed = await this.hashPassword(this.data.password);
      this.data.password = hashed;

      let [err, inserted] = await to(db.User.create(this.data));

      if (err) {
        throw err;
      }
      return new User(inserted);
    }

    if (!this.isHashed(this.data.password)) {
      let hashed = await this.hashPassword(this.data.password);
      this.data.password = hashed;

      const [err] = await to(
        db.User.updateOne(
          {
            _id: this.data._id,
          },
          this.data,
          {}
        ).exec()
      );

      if (err) {
        throw err;
      }
      return this;
    } else {
      let [err] = await to(
        db.User.findByIdAndUpdate(this.data._id, this.data, {}).exec()
      );
      if (err) {
        throw err;
      }
      return this;
    }
  }

  async deleteUser() {
    const [err] = await to(
      db.User.deleteOne({
        _id: this.data._id,
      }).exec()
    );

    if (err) {
      throw err;
    }
    return;
  }
}
