import React from "react";
import { withRouter } from "react-router-dom";
import {
  defaultMainState,
  Actions,
  mainReducer,
  mainReducerMiddleware,
} from "../../store/index";

export interface MainStore {
  dispatch: any;
  state: any;
}

// Make a context
export const MainContext = React.createContext<MainStore>({
  dispatch: null,
  state: null,
});

type ProviderWithRouterProps = {
  children: React.ReactNode;
};

let initialDispatchDone = false;

export const ProviderWithRouter = (props: ProviderWithRouterProps) => {
  const [_state, dispatchToMainReducer] = React.useReducer(
    mainReducer,
    defaultMainState
  );
  const _dispatch = mainReducerMiddleware(dispatchToMainReducer);

  if (!initialDispatchDone) {
    // initialize session
    _dispatch({
      type: Actions.REQUEST_SESSION_FETCH,
    });
    initialDispatchDone = true;
  }

  return (
    <MainContext.Provider value={{ dispatch: _dispatch, state: _state }}>
      {props.children}
    </MainContext.Provider>
  );
};

export const provider = withRouter(ProviderWithRouter);
