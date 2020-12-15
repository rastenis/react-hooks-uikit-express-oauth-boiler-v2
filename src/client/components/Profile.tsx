import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "../store";
import { MainContext, MainStore } from "./layout/ProviderWithRouter";

export class Profile extends Component {
  store: MainStore;

  // local state
  state: {
    oldPassword: string;
    newPassword: string;
    newPasswordConf: string;
    errors: string[];
  } = { oldPassword: "", newPassword: "", newPasswordConf: "", errors: [] };

  constructor(args) {
    super(args);
    this.store = React.useContext(MainContext);
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitPasswordChange = () => {
    // clearing previous errors
    this.state.errors = [];

    // non-matching passwords
    if (this.state.newPassword != this.state.newPasswordConf) {
      this.store.dispatch({
        type: Actions.ADD_MESSAGE,
        payload: {
          error: true,
          msg: "Passwords do not match!",
        },
      });
      this.state.errors.push("password");
      return;
    }

    // invalid password length
    if (
      this.state.newPassword.length < 5 ||
      this.state.newPassword.length > 100
    ) {
      this.store.dispatch({
        type: Actions.ADD_MESSAGE,
        payload: {
          error: true,
          msg: "Password must be between 5 and a 100 characters!",
        },
      });
      this.state.errors.push("password");
      return;
    }

    // proceeding
    this.store.dispatch({
      type: Actions.DO_PASSWORD_CHANGE,
      payload: {
        oldPassword: this.state.oldPassword,
        newPassword: this.state.newPassword,
      },
    });

    // resetting form
    this.state.newPassword = "";
    this.state.newPasswordConf = "";
    this.state.oldPassword = "";
  };

  submitUnlinkAuth = (e) => {
    this.store.dispatch({
      type: Actions.DO_AUTH_UNLINK,
      payload: e.target.dataset.target,
    });
  };

  render() {
    return (
      <div>
        <h1 className="uk-header-medium uk-text-center">Profile</h1>
        <hr />
        <div
          style={{ width: "60%" }}
          className="uk-form-stacked uk-container uk-container-center"
        >
          {Object.keys(this.store.state.data || {}).length ? (
            this.store.state.data.userData.password ? (
              <div className="uk-margin">
                <h3>Change Password</h3>
                <label className="uk-form-label" htmlFor="form-stacked-text">
                  Old Password
                </label>
                <div className="uk-form-controls uk-margin-small-bottom">
                  <input
                    className={`uk-input ${
                      this.state.errors.find((e) => e == "password")
                        ? "uk-form-danger"
                        : null
                    }`}
                    id="form-stacked-text"
                    name="oldPassword"
                    type="password"
                    placeholder="Old Password"
                    onChange={this.onChange}
                    value={this.state.oldPassword}
                  />
                </div>
                <label className="uk-form-label" htmlFor="form-stacked-text">
                  New Password
                </label>
                <div className="uk-form-controls uk-margin-small-bottom">
                  <input
                    className={`uk-input ${
                      this.state.errors.find((e) => e == "password")
                        ? "uk-form-danger"
                        : null
                    }`}
                    id="form-stacked-text"
                    name="newPassword"
                    type="password"
                    placeholder="New Password"
                    onChange={this.onChange}
                    value={this.state.newPassword}
                  />
                </div>
                <label className="uk-form-label" htmlFor="form-stacked-text">
                  Confirm New Password
                </label>
                <div className="uk-form-controls uk-margin-small-bottom">
                  <input
                    className={`uk-input ${
                      this.state.errors.find((e) => e == "password")
                        ? "uk-form-danger"
                        : null
                    }`}
                    id="form-stacked-text"
                    name="newPasswordConf"
                    type="password"
                    placeholder="Password"
                    onChange={this.onChange}
                    value={this.state.newPasswordConf}
                  />
                </div>
                <div className="uk-form-controls uk-margin-small-bottom">
                  <button
                    type="button"
                    className="uk-button uk-button-secondary uk-width-expand"
                    onClick={this.submitPasswordChange}
                  >
                    Change Password
                  </button>
                </div>
                <hr className=" uk-margin-small-top" />
              </div>
            ) : null
          ) : null}
        </div>
        <div
          style={{ width: "60%" }}
          className="uk-form-stacked uk-container uk-container-center"
        >
          <h3>Linked Accounts</h3>
          {Object.keys(this.store.state.data || {}).length > 0 ? (
            this.store.state.data.userData.google ? (
              <button
                type="button"
                className="uk-button uk-button-danger  uk-width-expand uk-margin-small-bottom"
                onClick={this.submitUnlinkAuth}
                data-target="google"
                disabled={
                  !(
                    this.store.state.data.userData.tokens.length > 1 ||
                    this.store.state.data.userData.password
                  )
                }
              >
                <span
                  uk-icon="icon: google"
                  className=" uk-margin-small-right"
                />
                Unlink Google
              </button>
            ) : (
              <a
                type="button"
                className="uk-button uk-button-default uk-width-expand uk-margin-small-bottom"
                href="/auth/google"
              >
                <span
                  uk-icon="icon: google"
                  className=" uk-margin-small-right"
                />
                Link Google
              </a>
            )
          ) : null}

          {Object.keys(this.store.state.data || {}).length > 0 ? (
            this.store.state.data.userData.twitter ? (
              <button
                type="button"
                className="uk-button uk-button-danger uk-width-expand uk-margin-small-bottom"
                onClick={this.submitUnlinkAuth}
                data-target="twitter"
                disabled={
                  !(
                    this.store.state.data.userData.tokens.length > 1 ||
                    this.store.state.data.userData.password
                  )
                }
              >
                <span
                  uk-icon="icon: twitter"
                  className=" uk-margin-small-right"
                />
                Unlink Twitter
              </button>
            ) : (
              <a
                type="button"
                className="uk-button uk-button-default uk-width-expand uk-margin-small-bottom"
                href="/auth/twitter"
              >
                <span
                  uk-icon="icon: twitter"
                  className=" uk-margin-small-right"
                />
                Link Twitter
              </a>
            )
          ) : null}
        </div>
      </div>
    );
  }
}
