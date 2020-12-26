import React, { Component, useState } from "react";
import { MainContext } from "./layout/ProviderWithRouter";
import { Actions } from "../store";

export const Login = () => {
  const store = React.useContext(MainContext);

  // state for this component only
  const [localState, setLocalState] = useState({ email: "", password: "" });

  const onChange = (e) => {
    setLocalState({ ...localState, [e.target.name]: e.target.value });
  };

  const submitLogin = () => {
    store.dispatch({
      type: Actions.DO_LOGIN,
      payload: { email: localState.email, password: localState.password },
    });
  };

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
              onChange={onChange}
              value={localState.email}
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
              onChange={onChange}
              value={localState.password}
            />
          </div>
          <div className="uk-form-controls uk-margin-small-bottom">
            <button
              type="button"
              className="uk-button uk-button-secondary uk-width-expand uk-margin-small-bottom"
              onClick={submitLogin}
            >
              Submit
            </button>

            {/* OPEN-AUTHENTICATOR */}
            {store.state.authStrategies?.map((strategy) => {
              return (
                <a
                  type="button"
                  className="uk-button uk-button-default uk-width-expand uk-margin-small-bottom"
                  href={`/oauth/strategy/${strategy}`}
                >
                  <span
                    uk-icon={`icon: ${strategy}`}
                    className="uk-margin-small-right"
                  />
                  <span>
                    Sign in with {strategy[0].toUpperCase() + strategy.slice(1)}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
};
