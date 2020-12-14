import { BrowserRouter, Switch, Route } from "react-router-dom";
import React from "react";

// components
import { ConnectedLogin } from "../Login";
import { ConnectedRegistration } from "../Registration";
import { ConnectedDashboard } from "../Dashboard";
import { ConnectedNavigation } from "./Navigation";
import {
  ConnectedOnlyAuthenticated,
  ConnectedOnlyUnauthenticated
} from "./PrivateRoute";
import { ConnectedMessages } from "./Messages";
import { ConnectedUserInformation } from "../UserInformation";
import { ConnectedProfile } from "../Profile";

// store
import ProviderWithRouter from "./ProviderWithRouter";

export default function Layout() {
  return (
    <div>
      <BrowserRouter>
        <ProviderWithRouter>
          <ConnectedNavigation />
          <ConnectedMessages />
          <div className="uk-container uk-width-1-3 uk-margin-medium-top">
            <Switch>
              <Route exact path="/" component={ConnectedDashboard} />
              <ConnectedOnlyUnauthenticated
                path="/login"
                component={ConnectedLogin}
              />
              <ConnectedOnlyAuthenticated
                path="/user/:index"
                component={ConnectedUserInformation}
              />
              <ConnectedOnlyUnauthenticated
                path="/registration"
                component={ConnectedRegistration}
              />
              <ConnectedOnlyAuthenticated
                path="/profile"
                component={ConnectedProfile}
              />
            </Switch>
          </div>
        </ProviderWithRouter>
      </BrowserRouter>
    </div>
  );
}
