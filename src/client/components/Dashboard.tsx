import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { AuthState, MainStore } from "../store/index";
import { MainContext } from "./layout/ProviderWithRouter";

export interface DashboardProps {
  auth: AuthState;
  data: any;
}

export const Dashboard = () => {
  const store: MainStore = React.useContext(MainContext);

  return (
    <div>
      <h1 className="uk-header-medium uk-text-center">Dashboard</h1>
      <hr className="uk-margin-medium-bottom" />

      {store.state.auth === AuthState.NOT_AUTHENTICATED ? ( // waiting for async data
        // showing non-auth notice
        <p>Log in to view data.</p>
      ) : store.state.auth === AuthState.AUTHENTICATED ? (
        // listing out people (if data contains people to list)
        <ul className="uk-list uk-list-divider">
          {store.state.people.map((person, index) => {
            return (
              <li key={index}>
                {person.name}{" "}
                <NavLink
                  to={`/user/${index}`}
                  className="uk-button-default uk-button-small uk-float-right"
                >
                  Details
                </NavLink>
              </li>
            );
          })}
        </ul>
      ) : (
        <span className="uk-position-center" data-uk-spinner={"ratio: 3"} />
      )}
    </div>
  );
};
