import React, { Component, useState } from "react";
import { Actions } from "../store";
import { MainContext } from "./layout/ProviderWithRouter";

export const Registration = () => {
  const store = React.useContext(MainContext);

  // state for this component only
  const [localState, setLocalState] = useState({
    email: "",
    password: "",
    passwordConf: "",
    errors: [] as string[],
  });

  const onChange = (e) => {
    setLocalState({ ...localState, [e.target.name]: e.target.value });
  };

  const submitRegistration = async () => {
    // clearing previous errors
    const newState = { ...localState, errors: [] };

    // quick check for email validity
    if (!/\S+@\S+\.\S+/.test(localState.email)) {
      store.dispatch({
        type: Actions.ADD_MESSAGE,
        payload: {
          error: true,
          msg: "Invalid email address!",
        },
      });

      setLocalState({
        ...newState,
        errors: ["email"],
      });
      return;
    }

    // invalid password length
    if (localState.password.length < 5 || localState.password.length > 100) {
      store.dispatch({
        type: Actions.ADD_MESSAGE,
        payload: {
          error: true,
          msg: "Password must be between 5 and a 100 characters!",
        },
      });

      setLocalState({
        ...newState,
        errors: ["password"],
      });
      return;
    }

    // non-matching passwords
    if (localState.password != localState.passwordConf) {
      store.dispatch({
        type: Actions.ADD_MESSAGE,
        payload: {
          error: true,
          msg: "Passwords do not match!",
        },
      });

      setLocalState({
        ...newState,
        errors: ["password"],
      });
      return;
    }

    setLocalState({
      ...newState,
    });

    // proceeding
    store.dispatch({
      type: Actions.DO_REGISTRATION,
      payload: {
        email: localState.email,
        password: localState.password,
      },
    });
  };

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
                localState.errors.find((e) => e == "email")
                  ? "uk-form-danger"
                  : null
              }`}
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
              className={`uk-input ${
                localState.errors.find((e) => e == "password")
                  ? "uk-form-danger"
                  : null
              }`}
              id="form-stacked-text"
              name="password"
              type="password"
              placeholder="Password"
              onChange={onChange}
              value={localState.password}
            />
          </div>
          <label className="uk-form-label" htmlFor="form-stacked-text">
            Confirm Password
          </label>
          <div className="uk-form-controls uk-margin-small-bottom">
            <input
              className={`uk-input ${
                localState.errors.find((e) => e == "password")
                  ? "uk-form-danger"
                  : null
              }`}
              id="form-stacked-text"
              name="passwordConf"
              type="password"
              placeholder="Confirm password"
              onChange={onChange}
              value={localState.passwordConf}
            />
          </div>
          <div className="uk-form-controls uk-margin-small-bottom">
            <button
              type="button"
              className="uk-button uk-button-primary uk-width-expand"
              onClick={submitRegistration}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
