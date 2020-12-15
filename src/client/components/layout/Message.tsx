import { Store } from "express-session";
import React, { Component } from "react";
import { Actions } from "../../store";
import { MainContext, MainStore } from "./ProviderWithRouter";

interface MessageProps {
  message: any;
}

export class Message extends Component<MessageProps> {
  store: MainStore;
  state: { closeTimeout?: number | undefined } = {}; // local state

  constructor(args) {
    super(args);
    this.store = React.useContext(MainContext);
    this.state = {};
  }

  componentDidMount() {
    this.setState({
      closer: setTimeout(() => {
        this.store.dispatch({
          type: Actions.DELETE_MESSAGE,
          payload: this.props.message.id,
        });
      }, 3000),
    });
  }

  setCancelled = () => {
    clearTimeout(this.state.closeTimeout);
  };

  render() {
    return (
      <div
        className={`${
          this.props.message.error ? "uk-alert-danger" : "uk-alert-primary"
        }`}
        uk-alert="true"
      >
        <a
          className="uk-alert-close"
          uk-close="true"
          onClick={this.setCancelled}
        />
        <p>{this.props.message.msg}</p>
      </div>
    );
  }
}
