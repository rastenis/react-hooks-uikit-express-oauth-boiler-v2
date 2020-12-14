import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import * as mutations from "../../store/mutations";

class Navigation extends Component {
  render() {
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
                activeStyle={{ className: "uk-active", color: "black" }}
                to="/"
              >
                Dashboard
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="uk-navbar-right">
          {this.props.auth == mutations.AUTHENTICATED ? (
            <ul className="uk-navbar-nav">
              <li>
                <NavLink
                  exact
                  activeStyle={{ className: "uk-active", color: "black" }}
                  to="/profile"
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <a
                  className="uk-text-danger"
                  onClick={this.props.requestLogout}
                >
                  Logout
                </a>
              </li>
            </ul>
          ) : this.props.auth == mutations.WAITING ? null : (
            <ul className="uk-navbar-nav">
              <li>
                <NavLink
                  exact
                  activeStyle={{ className: "uk-active", color: "black" }}
                  to="/login"
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  exact
                  activeStyle={{ className: "uk-active", color: "black" }}
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
  }
}

const requestLogout = () => {
  return mutations.requestLogout();
};

const mapStateToProps = ({ auth }) => ({
  auth
});

const mapDispatchToProps = {
  requestLogout
};

export const ConnectedNavigation = connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);
