import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { AuthState } from "../store";
import { MainContext, MainStore } from "./layout/ProviderWithRouter";

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

      <ul className="uk-list uk-list-divider">
        {store.reducer.auth ? ( // waiting for async data
          store.reducer.auth == AuthState.WAITING ? (
            <span
              className="   uk-position-center"
              data-uk-spinner={"ratio: 3"}
            />
          ) : store.reducer.data.people ? ( // listing out people (if data contains people to list)
            store.reducer.data.people.map((person, index) => {
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
            })
          ) : null
        ) : (
          // showing non-auth notice
          <p>Log in to view data.</p>
        )}
      </ul>
    </div>
  );
};
