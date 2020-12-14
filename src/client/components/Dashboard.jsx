import React, { Component } from "react";
import * as mutations from "../store/mutations";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

class Dashboard extends Component {
  render() {
    return (
      <div>
        <h1 className="uk-header-medium uk-text-center">Dashboard</h1>
        <hr className="uk-margin-medium-bottom" />

        <ul className="uk-list uk-list-divider">
          {this.props.auth ? ( // waiting for async data
            this.props.auth == mutations.WAITING ? (
              <span
                className="   uk-position-center"
                data-uk-spinner={"ratio: 3"}
              />
            ) : this.props.data.people ? ( // listing out people (if data contains people to list)
              this.props.data.people.map((person, index) => {
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
  }
}

const mapStateToProps = ({ auth, data }) => ({
  auth,
  data
});

export const ConnectedDashboard = connect(mapStateToProps)(Dashboard);
