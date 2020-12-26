import React, { Component, useState } from "react";
import { Actions } from "../store";
import { MainContext } from "./layout/ProviderWithRouter";

export const Profile = () => {
  const store = React.useContext(MainContext);

  // state for this component only
  const [localState, setLocalState] = useState({
    oldPassword: "",
    newPassword: "",
    newPasswordConf: "",
    errors: [] as string[],
  });

  const onChange = (e) => {
    setLocalState({ ...localState, [e.target.name]: e.target.value });
  };

  const submitPasswordChange = () => {
    // clearing previous errors
    const newState = { ...localState, errors: [] };

    // non-matching passwords
    if (localState.newPassword != localState.newPasswordConf) {
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

    // invalid password length
    if (
      localState.newPassword.length < 5 ||
      localState.newPassword.length > 100
    ) {
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

    // proceeding
    store.dispatch({
      type: Actions.DO_PASSWORD_CHANGE,
      payload: {
        oldPassword: localState.oldPassword,
        newPassword: localState.newPassword,
      },
    });

    // resetting form
    setLocalState({
      ...newState,
      oldPassword: "",
      newPassword: "",
      newPasswordConf: "",
    });
  };

  const submitUnlinkAuth = (e) => {
    store.dispatch({
      type: Actions.DO_AUTH_UNLINK,
      payload: e.target.dataset.target,
    });
  };

  return (
    <div>
      <h1 className="uk-header-medium uk-text-center">Profile</h1>
      <hr />
      <div
        style={{ width: "60%" }}
        className="uk-form-stacked uk-container uk-container-center"
      >
        {/* Password management */}
        {Object.keys(store.state.userData || {}).length ? (
          store.state.userData.password ? (
            <div className="uk-margin">
              <h3>Change Password</h3>
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Old Password
              </label>
              <div className="uk-form-controls uk-margin-small-bottom">
                <input
                  className={`uk-input ${
                    localState.errors.find((e) => e == "password")
                      ? "uk-form-danger"
                      : null
                  }`}
                  id="form-stacked-text"
                  name="oldPassword"
                  type="password"
                  placeholder="Old Password"
                  onChange={onChange}
                  value={localState.oldPassword}
                />
              </div>
              <label className="uk-form-label" htmlFor="form-stacked-text">
                New Password
              </label>
              <div className="uk-form-controls uk-margin-small-bottom">
                <input
                  className={`uk-input ${
                    localState.errors.find((e) => e == "password")
                      ? "uk-form-danger"
                      : null
                  }`}
                  id="form-stacked-text"
                  name="newPassword"
                  type="password"
                  placeholder="New Password"
                  onChange={onChange}
                  value={localState.newPassword}
                />
              </div>
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Confirm New Password
              </label>
              <div className="uk-form-controls uk-margin-small-bottom">
                <input
                  className={`uk-input ${
                    localState.errors.find((e) => e == "password")
                      ? "uk-form-danger"
                      : null
                  }`}
                  id="form-stacked-text"
                  name="newPasswordConf"
                  type="password"
                  placeholder="Password"
                  onChange={onChange}
                  value={localState.newPasswordConf}
                />
              </div>
              <div className="uk-form-controls uk-margin-small-bottom">
                <button
                  type="button"
                  className="uk-button uk-button-secondary uk-width-expand"
                  onClick={submitPasswordChange}
                >
                  Change Password
                </button>
              </div>
              <hr className=" uk-margin-small-top" />
            </div>
          ) : null
        ) : null}
      </div>

      {/* OAuth management */}
      {store.state.authStrategies?.length ? (
        <div>
          <h3>Linked Accounts</h3>
          <div
            style={{ width: "60%" }}
            className="uk-form-stacked uk-container uk-container-center"
          >
            {store.state.authStrategies?.map((strategy) => {
              return store.state?.userData?.tokens?.[strategy] ? (
                <button
                  type="button"
                  className="uk-button uk-button-danger  uk-width-expand uk-margin-small-bottom"
                  onClick={submitUnlinkAuth}
                  data-target={strategy}
                  disabled={
                    !(
                      Object.keys(store.state.userData.tokens).length > 1 || // if the amount of linked oauth methods is 1 or less, and the user does not have a password, unlink is not permitted.
                      store.state.userData.password
                    )
                  }
                >
                  <span
                    uk-icon={`icon: ${strategy}`}
                    className="uk-margin-small-right"
                  />
                  Unlink {strategy[0].toUpperCase() + strategy.slice(1)}
                </button>
              ) : (
                <a
                  type="button"
                  className="uk-button uk-button-default uk-width-expand uk-margin-small-bottom"
                  href={`/oauth/strategy/${strategy}`}
                >
                  <span
                    uk-icon={`icon: ${strategy}`}
                    className="uk-margin-small-right"
                  />
                  Link {strategy[0].toUpperCase() + strategy.slice(1)}
                </a>
              );
            })}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
