import React, { Component } from "react";
import { Actions } from "../store";
import { MainContext, MainStore } from "./layout/ProviderWithRouter";

export class Registration extends Component {
  store: MainStore;
  state: {
    email: string;
    password: string;
    passwordConf: string;
    errors: string[];
  } = { email: "", password: "", passwordConf: "", errors: [] }; // local state

  constructor(args) {
    super(args);
    this.store = React.useContext(MainContext);
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitRegistration = () => {
    // clearing previous errors
    this.state.errors = [];

    // quick check for email validity
    if (!/\S+@\S+\.\S+/.test(this.state.email)) {
      this.store.dispatch({
        type: Actions.ADD_MESSAGE,
        payload: {
          error: true,
          msg: "Invalid email address!",
        },
      });
      this.state.errors.push("email");
      return;
    }

    // invalid password length
    if (this.state.password.length < 5 || this.state.password.length > 100) {
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

    // non-matching passwords
    if (this.state.password != this.state.passwordConf) {
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

    // proceeding
    this.store.dispatch({
      type: Actions.DO_REGISTRATION,
      payload: {
        email: this.state.email,
        password: this.state.password,
      },
    });
  };

  render() {
    return (
      <div>
        <h1 className="uk-header-medium uk-text-center">Register</h1>
        <hr />
        <form
          style={{ width: "60%" }}
          className="uk-form-stacked uk-container uk-container-center"
        >
          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="form-stacked-text">
              Email
            </label>
            <div className="uk-form-controls uk-margin-small-bottom">
              <input
                className={`uk-input ${
                  this.state.errors.find((e) => e == "email")
                    ? "uk-form-danger"
                    : null
                }`}
                id="form-stacked-text"
                type="text"
                placeholder="Email"
                name="email"
                onChange={this.onChange}
                value={this.state.email}
              />
            </div>
            <label className="uk-form-label" htmlFor="form-stacked-text">
              Password
            </label>
            <div className="uk-form-controls uk-margin-small-bottom">
              <input
                className={`uk-input ${
                  this.state.errors.find((e) => e == "password")
                    ? "uk-form-danger"
                    : null
                }`}
                id="form-stacked-text"
                name="password"
                type="password"
                placeholder="Password"
                onChange={this.onChange}
                value={this.state.password}
              />
            </div>
            <label className="uk-form-label" htmlFor="form-stacked-text">
              Confirm Password
            </label>
            <div className="uk-form-controls uk-margin-small-bottom">
              <input
                className={`uk-input ${
                  this.state.errors.find((e) => e == "password")
                    ? "uk-form-danger"
                    : null
                }`}
                id="form-stacked-text"
                name="passwordConf"
                type="password"
                placeholder="Confirm password"
                onChange={this.onChange}
                value={this.state.passwordConf}
              />
            </div>
            <div className="uk-form-controls uk-margin-small-bottom">
              <button
                type="button"
                className="uk-button uk-button-primary uk-width-expand"
                onClick={this.submitRegistration}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
