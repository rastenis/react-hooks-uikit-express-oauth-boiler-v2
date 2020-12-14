import { Redirect, Route } from "react-router";
import React from "react";
import { connect } from "react-redux";

import * as mutations from "../../store/mutations";

const OnlyUnauthenticated = ({ component: Component, auth, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return auth === mutations.AUTHENTICATED ? (
          <Redirect to="/" />
        ) : (
          <Component {...props} />
        );
      }}
    />
  );
};

const OnlyAuthenticated = ({ component: Component, auth, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return auth !== mutations.AUTHENTICATED ? (
          <Redirect to="/" />
        ) : (
          <Component {...props} />
        );
      }}
    />
  );
};

const mapStateToProps = ({ auth }) => ({
  auth
});

export const ConnectedOnlyAuthenticated = connect(mapStateToProps)(
  OnlyAuthenticated
);
export const ConnectedOnlyUnauthenticated = connect(mapStateToProps)(
  OnlyUnauthenticated
);
