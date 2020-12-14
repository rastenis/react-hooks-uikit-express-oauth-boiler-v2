import React, { Component } from "react";
import * as mutations from "../store/mutations";
import { connect } from "react-redux";

class Profile extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      oldPassword: "",
      newPassword: "",
      newPasswordConf: "",
      errors: []
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitPasswordChange = () => {
    // clearing previous errors
    this.state.errors = [];

    // non-matching passwords
    if (this.state.newPassword != this.state.newPasswordConf) {
      this.props.addMessage({
        error: true,
        msg: "Passwords do not match!"
      });
      this.state.errors.push("password");
      return;
    }

    // invalid password length
    if (
      this.state.newPassword.length < 5 ||
      this.state.newPassword.length > 100
    ) {
      this.props.addMessage({
        error: true,
        msg: "Password must be between 5 and a 100 characters!"
      });
      this.state.errors.push("password");
      return;
    }

    // proceeding
    this.props.changePassword(this.state.oldPassword, this.state.newPassword);

    // resetting form
    this.state.newPassword = "";
    this.state.newPasswordConf = "";
    this.state.oldPassword = "";
  };

  submitUnlinkAuth = e => {
    this.props.unlinkAuth(e.target.dataset.target);
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
          {Object.keys(this.props.data || {}).length ? (
            this.props.data.userData.password ? (
              <div className="uk-margin">
                <h3>Change Password</h3>
                <label className="uk-form-label" htmlFor="form-stacked-text">
                  Old Password
                </label>
                <div className="uk-form-controls uk-margin-small-bottom">
                  <input
                    className={`uk-input ${
                      this.state.errors.find(e => e == "password")
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
                      this.state.errors.find(e => e == "password")
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
                      this.state.errors.find(e => e == "password")
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
          {Object.keys(this.props.data || {}).length > 0 ? (
            this.props.data.userData.google ? (
              <button
                type="button"
                className="uk-button uk-button-danger  uk-width-expand uk-margin-small-bottom"
                onClick={this.submitUnlinkAuth}
                data-target="google"
                disabled={
                  !(
                    this.props.data.userData.tokens.length > 1 ||
                    this.props.data.userData.password
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

          {Object.keys(this.props.data || {}).length > 0 ? (
            this.props.data.userData.twitter ? (
              <button
                type="button"
                className="uk-button uk-button-danger uk-width-expand uk-margin-small-bottom"
                onClick={this.submitUnlinkAuth}
                data-target="twitter"
                disabled={
                  !(
                    this.props.data.userData.tokens.length > 1 ||
                    this.props.data.userData.password
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

const changePassword = (o, n) => {
  return mutations.requestPasswordChange(o, n);
};

const unlinkAuth = toUnlink => {
  return mutations.requestAuthUnlink(toUnlink);
};
const addMessage = m => {
  return mutations.addMessage(m);
};

const mapStateToProps = ({ auth, messages, data }) => ({
  auth,
  messages,
  data
});

const mapDispatchToProps = {
  changePassword,
  unlinkAuth,
  addMessage
};

export const ConnectedProfile = connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
