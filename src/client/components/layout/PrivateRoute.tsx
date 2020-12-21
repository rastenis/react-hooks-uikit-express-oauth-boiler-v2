import { Redirect, Route } from "react-router";
import React from "react";

import { AuthState } from "../../store";
import { MainContext } from "./ProviderWithRouter";

export const OnlyUnauthenticated = ({ component: Component, ...rest }) => {
  const { state } = React.useContext(MainContext);
  return (
    <Route
      {...rest}
      render={(props) => {
        return state.auth === AuthState.AUTHENTICATED ? (
          <Redirect to="/" />
        ) : (
          <Component {...props} />
        );
      }}
    />
  );
};

export const OnlyAuthenticated = ({ component: Component, ...rest }) => {
  const { state } = React.useContext(MainContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        return state.auth !== AuthState.AUTHENTICATED ? (
          <Redirect to="/" />
        ) : (
          <Component {...props} />
        );
      }}
    />
  );
};
