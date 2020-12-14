import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

class UserInformation extends PureComponent {
  constructor(...args) {
    super(...args);

    // shortening reference
    this.person = this.props.people[this.props.match.params.index];
  }
  render() {
    return (
      <div>
        <h2 className="uk-header-medium uk-text-center">{this.person.name}</h2>
        <hr className="uk-margin-medium-bottom" />
        {
          <div>
            <div style={{ display: "inline-flex" }}>
              <b className=" uk-margin-small-right">Email:</b>
              {this.person.email}
            </div>
            <hr />
            <div style={{ display: "inline-flex" }}>
              <b className=" uk-margin-small-right">Phone:</b>
              {this.person.contact.phone}
            </div>
            <hr />
            <div style={{ display: "inline-flex" }}>
              <div className="uk-text-bottom">
                <b className=" uk-margin-small-right">Company:</b>
                {this.person.contact.company.name}
              </div>
            </div>
            <hr />
            <div style={{ display: "inline-flex" }}>
              <b className=" uk-margin-small-right">Address:</b>
              {`${this.person.contact.address.streetA}, ${
                this.person.contact.address.city
              }, ${this.person.contact.address.state} ${
                this.person.contact.address.zipcode
              }`}
            </div>
            <NavLink
              to="/"
              className=" uk-display-block uk-text-center uk-button-default uk-button-small uk-margin-medium-top"
            >
              back
            </NavLink>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = ({ auth, data: { people } }) => ({
  auth,
  people
});

export const ConnectedUserInformation = connect(mapStateToProps)(
  UserInformation
);

// TODO: proptypes
