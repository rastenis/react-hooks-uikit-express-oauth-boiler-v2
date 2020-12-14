import React, { Component } from "react";
import { connect } from "react-redux";
import { ConnectedMessage } from "./Message";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import "../style/Message.css";

export class Messages extends Component {
  render() {
    return (
      <div className="uk-container uk-width-1-2 uk-margin-medium-top">
        <ReactCSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {this.props.messages.length
            ? this.props.messages.map((m, index) => {
                return <ConnectedMessage key={index} message={m} />;
              })
            : null}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

const mapStateToProps = ({ messages }) => ({
  messages
});

export const ConnectedMessages = connect(mapStateToProps)(Messages);
