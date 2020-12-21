import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { MainContext } from "./ProviderWithRouter";
import { Actions, AuthState } from "../../store";

export const Navigation = () => {
  const store = React.useContext(MainContext);

  return (
    <nav className="uk-navbar-container uk-navbar" uk-navbar="true">
      <div className="uk-navbar-left">
        <ul className="uk-navbar-nav">
          <li
            className="uk-logo uk-text-middle uk-navbar-item"
            style={{ fontWeight: "bold" }}
          >
            boiler
          </li>
          <li className="uk-margin-large-right" />
          <li>
            <NavLink
              exact
              activeStyle={{ color: "black" }}
              activeClassName="uk-active"
              to="/"
            >
              Dashboard
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="uk-navbar-right">
        {store.state.auth == AuthState.AUTHENTICATED ? (
          <ul className="uk-navbar-nav">
            <li>
              <NavLink
                exact
                activeStyle={{ color: "black" }}
                activeClassName="uk-active"
                to="/profile"
              >
                Profile
              </NavLink>
            </li>
            <li>
              <a
                className="uk-text-danger"
                onClick={() => store.dispatch({ type: Actions.DO_LOGOUT })}
              >
                Logout
              </a>
            </li>
          </ul>
        ) : store.state.auth == AuthState.WAITING ? null : (
          <ul className="uk-navbar-nav">
            <li>
              <NavLink
                exact
                activeStyle={{ color: "black" }}
                activeClassName="uk-active"
                to="/login"
              >
                Login
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeStyle={{ color: "black" }}
                activeClassName="uk-active"
                to="/registration"
              >
                Register
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};
