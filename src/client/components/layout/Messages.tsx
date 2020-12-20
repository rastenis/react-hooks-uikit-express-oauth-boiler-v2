import React from "react";
import { Message } from "./Message";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import "../style/Message.css";
import { MainContext } from "./ProviderWithRouter";

export const Messages = () => {
  const { state } = React.useContext(MainContext);
  return (
    <div className="uk-container uk-width-1-2 uk-margin-medium-top">
      {state.messages?.length ? (
        <ReactCSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {state.messages.map((m, index) => {
            return <Message key={index} message={m} />;
          })}
        </ReactCSSTransitionGroup>
      ) : (
        ""
      )}
    </div>
  );
};
