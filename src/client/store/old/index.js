import { createStore, applyMiddleware } from "redux";
import { reducer } from "./reducer";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";
import * as sagas from "./sagas";
import { composeWithDevTools } from "redux-devtools-extension";

export default (initialState, context = {}) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    reducer,
    initialState,
    process.env.NODE_ENV == `production` // adding redux dev tools and logger if running in devmode
      ? applyMiddleware(sagaMiddleware)
      : composeWithDevTools(applyMiddleware(createLogger(), sagaMiddleware))
  );

  for (let saga in sagas) {
    sagaMiddleware.run(sagas[saga], context);
  }
  return store;
};
