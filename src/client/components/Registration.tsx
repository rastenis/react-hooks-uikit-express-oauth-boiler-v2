import React, { Component } from "react";
import * as mutations from "../store/mutations";
import { connect } from "react-redux";

class Registration extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      email: "",
      password: "",
      passwordConf: "",
      errors: []
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitRegistration = () => {
    // clearing previous errors
    this.state.errors = [];

    // validation
    if (!/\S+@\S+\.\S+/.test(this.state.email)) {
      this.props.addMessage({ error: true, msg: "Invalid email address!" });
      this.state.errors.push("email");
      return;
    }

    // invalid password length
    if (this.state.password.length < 5 || this.state.password.length > 100) {
      this.props.addMessage({
        error: true,
        msg: "Password must be between 5 and a 100 characters!"
      });
      this.state.errors.push("password");
      return;
    }

    // non-matching passwords
    if (this.state.password != this.state.passwordConf) {
      this.props.addMessage({
        error: true,
        msg: "Passwords do not match!"
      });
      this.state.errors.push("password");
      return;
    }

    // proceeding
    this.props.registerUser(this.state.email, this.state.password);
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
                  this.state.errors.find(e => e == "email")
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
                  this.state.errors.find(e => e == "password")
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
                  this.state.errors.find(e => e == "password")
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

const registerUser = (e, p) => {
  return mutations.requestAccountCreation(e, p);
};

const addMessage = m => {
  return mutations.addMessage(m);
};

const mapStateToProps = ({ auth, messages }) => ({
  auth,
  messages
});

const mapDispatchToProps = {
  registerUser,
  addMessage
};

export const ConnectedRegistration = connect(
  mapStateToProps,
  mapDispatchToProps
)(Registration);
