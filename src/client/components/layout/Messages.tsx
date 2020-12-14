import React, { Component } from "react";
import { connect } from "react-redux";
import { ConnectedMessage } from "./Message";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import "../style/Message.css";
import { MainContext } from "./ProviderWithRouter";

export const Messages = (props) => {
  const { reducer } = React.useContext(MainContext);

  if (!reducer) {
    return;
  }

  return (
    <div className="uk-container uk-width-1-2 uk-margin-medium-top">
      <ReactCSSTransitionGroup
        transitionName="fade"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        {reducer.messages.length
          ? reducer.messages.map((m, index) => {
              return <ConnectedMessage key={index} message={m} />;
            })
          : null}
      </ReactCSSTransitionGroup>
    </div>
  );
};
