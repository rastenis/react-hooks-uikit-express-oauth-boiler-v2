import React from "react";
import { withRouter } from "react-router-dom";
import { defaultMainState, Actions, stateMainReducer } from "../../store/index";

export interface MainStore {
  dispatch: any;
  reducer: any;
}

export const MainContext = React.createContext<MainStore>({
  dispatch: null,
  reducer: null,
}); // React.createContext accepts a defaultValue as the first param

type ProviderWithRouterProps = {
  children: React.ReactNode;
};

class ProviderWithRouter extends React.Component<ProviderWithRouterProps> {
  _dispatch: any;
  _reducer: any;

  constructor(props) {
    super(props);

    // store
    [this._reducer, this._dispatch] = React.useReducer(
      stateMainReducer,
      defaultMainState
    );
    // initialize session
    this.dispatch({
      type: Actions.REQUEST_SESSION_FETCH,
    });
  }

  public get dispatch() {
    return this._dispatch;
  }

  public get reducer() {
    return this._reducer;
  }

  render() {
    return (
      <MainContext.Provider
        value={{ dispatch: this.dispatch, reducer: this.reducer }}
      >
        {this.props.children}
      </MainContext.Provider>
    );
  }
}

export const provider = withRouter(ProviderWithRouter);
