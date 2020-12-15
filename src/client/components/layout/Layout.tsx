import { BrowserRouter, Switch, Route } from "react-router-dom";
import React from "react";

// components
import { Login } from "../Login";
import { ConnectedRegistration } from "../Registration";
import { Dashboard } from "../Dashboard";
import { Navigation } from "./Navigation";
import { OnlyAuthenticated, OnlyUnauthenticated } from "./PrivateRoute";
import { Messages } from "./Messages";
import { ConnectedUserInformation } from "../UserInformation";
import { Profile } from "../Profile";

// store
import { provider as ProviderWithRouter } from "./ProviderWithRouter";

export default function Layout() {
  return (
    <div>
      <BrowserRouter>
        <ProviderWithRouter>
          <Navigation />
          <Messages />
          <div className="uk-container uk-width-1-3 uk-margin-medium-top">
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <OnlyUnauthenticated path="/login" component={Login} />
              <OnlyAuthenticated
                path="/user/:index"
                component={ConnectedUserInformation}
              />
              <OnlyUnauthenticated
                path="/registration"
                component={ConnectedRegistration}
              />
              <OnlyAuthenticated path="/profile" component={Profile} />
            </Switch>
          </div>
        </ProviderWithRouter>
      </BrowserRouter>
    </div>
  );
}
