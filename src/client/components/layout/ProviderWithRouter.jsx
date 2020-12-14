import React from "react";
import { Provider } from "react-redux";
import { withRouter } from "react-router-dom";
import store from "../../store";
import * as mutations from "../../store/mutations";

class ProviderWithRouter extends React.Component {
  constructor(props) {
    super(props);
    this.store = store(
      {},
      {
        routerHistory: props.history
      }
    );
    // TODO: serve this immediately
    // init
    this.store.dispatch({ type: mutations.REQUEST_SESSION_FETCH });
  }

  store() {
    return this.store;
  }

  render() {
    return <Provider store={this.store}>{this.props.children}</Provider>;
  }
}

const provider = withRouter(ProviderWithRouter);
export default provider;
