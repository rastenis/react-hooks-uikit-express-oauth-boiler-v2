import React, { Component } from "react";
import * as mutations from "../store/mutations";
import { connect } from "react-redux";

class Login extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      email: "",
      password: ""
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitLogin = () => {
    this.props.authenticateUser(this.state.email, this.state.password);
  };

  render() {
    return (
      <div>
        <h1 className="uk-header-medium uk-text-center">Login</h1>
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
                className="uk-input"
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
                className="uk-input"
                id="form-stacked-text"
                name="password"
                type="password"
                placeholder="Password"
                onChange={this.onChange}
                value={this.state.password}
              />
            </div>
            <div className="uk-form-controls uk-margin-small-bottom">
              <button
                type="button"
                className="uk-button uk-button-secondary uk-width-expand uk-margin-small-bottom"
                onClick={this.submitLogin}
              >
                Submit
              </button>
              <a
                type="button"
                className="uk-button uk-button-default uk-width-expand uk-margin-small-bottom"
                href="/auth/google"
              >
                <span
                  uk-icon="icon: google"
                  className=" uk-margin-small-right"
                />
                Sign in with Google
              </a>

              <a
                type="button"
                className="uk-button uk-button-default uk-width-expand uk-margin-small-bottom"
                href="/auth/twitter"
              >
                <span
                  uk-icon="icon: twitter"
                  className=" uk-margin-small-right"
                />
                Sign in with Twitter
              </a>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const authenticateUser = (e, p) => {
  return mutations.requestAuth(e, p);
};

const mapStateToProps = ({ auth, messages }) => ({
  auth,
  messages
});

const mapDispatchToProps = {
  authenticateUser
};

export const ConnectedLogin = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
