import React, { useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import {
  defaultMainState,
  Actions,
  mainReducer,
  mainReducerMiddleware,
  AuthState,
  Action,
  MainStore,
} from "../../store/index";

// Make a context
export const MainContext = React.createContext<MainStore>({
  dispatch: async (action: Action) => {}, //placeholder. This gets populated by ProviderWithRouter.
  state: defaultMainState,
  history: (undefined as unknown) as History,
});

type ProviderWithRouterProps = {
  children?: React.ReactNode;
};

/**
 * This instantiates the main store, and the history.
 * @param props contians child nodes
 */
export const ProviderWithRouter = (props: ProviderWithRouterProps) => {
  const [_state, dispatchToMainReducer] = React.useReducer(
    mainReducer,
    defaultMainState
  );
  const _history = useHistory();
  const _dispatch = mainReducerMiddleware(dispatchToMainReducer, _history);

  // only on initial render.
  useEffect(() => {
    // initialize session
    _dispatch({
      type: Actions.DO_SESSION_FETCH,
    });
  }, []);

  return (
    <MainContext.Provider
      value={{ dispatch: _dispatch, state: _state, history: _history }}
    >
      {props.children}
    </MainContext.Provider>
  );
};

export const provider = withRouter(ProviderWithRouter);
