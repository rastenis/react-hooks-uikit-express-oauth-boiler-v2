import React, { PureComponent } from "react";
import { NavLink } from "react-router-dom";
import { MainStore } from "../store";
import { MainContext } from "./layout/ProviderWithRouter";

export const UserInformation = ({ match }) => {
  const store: MainStore = React.useContext(MainContext);
  const person = store.state.people[match.params.index];

  return (
    <div>
      <h2 className="uk-header-medium uk-text-center">{person.name}</h2>
      <hr className="uk-margin-medium-bottom" />
      {
        <div>
          <div style={{ display: "inline-flex" }}>
            <b className=" uk-margin-small-right">Email:</b>
            {person.email}
          </div>
          <hr />
          <div style={{ display: "inline-flex" }}>
            <b className=" uk-margin-small-right">Phone:</b>
            {person.contact.phone}
          </div>
          <hr />
          <div style={{ display: "inline-flex" }}>
            <div className="uk-text-bottom">
              <b className=" uk-margin-small-right">Company:</b>
              {person.contact.company.name}
            </div>
          </div>
          <hr />
          <div style={{ display: "inline-flex" }}>
            <b className=" uk-margin-small-right">Address:</b>
            {`${person.contact.address.streetA}, ${person.contact.address.city}, ${person.contact.address.state} ${person.contact.address.zipcode}`}
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
};
