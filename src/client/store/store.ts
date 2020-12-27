import to from "await-to-js";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Action, AuthState, Actions, MainState } from "./types";
import { handleRequestError, handleRequestSuccess } from "./utils";

// NOTE: you may want to make multiple stores for more complex applications. Here, everything is lumped together for simplicity.

/**
 * This is for handling async actions, and then passiing the result on to the mainReducer, which is synchronous
 * @param dispatch the actual dispatch for mainReducer
 * @param history the history state
 */
export const mainReducerMiddleware = (dispatch, history) =>
  async function middleware(action: Action) {
    switch (action.type) {
      case Actions.DO_SESSION_FETCH: {
        const [error, res] = await to(axios.get(`/api/data`));
        handleRequestError(dispatch, error);

        const data = res?.data;

        const newState: MainState = {
          data: {},
          userData: data?.userData,
          people: data?.people,
          auth: data.auth
            ? AuthState.AUTHENTICATED
            : AuthState.NOT_AUTHENTICATED,
          messages: [],
          authStrategies: [],
        };

        // register server side messages, if any
        if (data.messages) {
          newState.messages.push(...data.messages);
        }

        dispatch({ type: Actions.SET_STATE, payload: newState });

        if (data.openAuthenticatorEnabled) {
          // Contacting open-authenticator to fetch strategies.
          middleware({
            type: Actions.DO_OPENAUTHENTICATOR_FETCH,
          });
        }

        break;
      }

      case Actions.DO_OPENAUTHENTICATOR_FETCH: {
        const [error, res] = await to(
          axios.get(`/oauth/strategies`, { timeout: 5000 })
        );
        // We do not need to show the clients errors for this; the login methods simply will not show up.

        const data = res?.data;

        const addition: any = {
          authStrategies: data,
        };

        dispatch({ type: Actions.SET_STATE, payload: addition });
        break;
      }

      case Actions.DO_PASSWORD_CHANGE: {
        const { oldPassword, newPassword } = action.payload;

        const [error, res] = await to(
          axios.post(`/api/changePassword`, {
            oldPassword,
            newPassword,
          })
        );
        handleRequestError(dispatch, error);

        // show message
        handleRequestSuccess(dispatch, res);
        break;
      }

      case Actions.DO_REGISTRATION: {
        const { email, password } = action.payload;

        const [error, res] = await to(
          axios.post(`/api/register`, {
            email,
            password,
          })
        );
        handleRequestError(dispatch, error);

        await middleware({ type: Actions.DO_SESSION_FETCH });

        // set profile
        dispatch({
          type: Actions.SET_STATE,
          payload: res?.data.state,
        });

        // show message
        handleRequestSuccess(dispatch, res);
        history.push("/");
        break;
      }

      case Actions.DO_LOGIN: {
        const { email, password } = action.payload;

        const [error, res] = await to(
          axios.post(`/api/login`, {
            email,
            password,
          })
        );
        handleRequestError(dispatch, error);

        await middleware({ type: Actions.DO_SESSION_FETCH });

        // set profile
        dispatch({
          type: Actions.SET_STATE,
          payload: res?.data.state,
        });

        // show message
        handleRequestSuccess(dispatch, res);

        // dispatch({
        //   type: Actions.SET_AUTH,
        //   payload: AuthState.AUTHENTICATED,
        // });

        history.push("/");
        break;
      }

      case Actions.DO_AUTH_UNLINK: {
        const strategyUnlinked = action.payload;

        const [error, res] = await to(
          axios.delete(`/oauth/strategy/${strategyUnlinked}`)
        );
        handleRequestError(dispatch, error);
        // show message
        handleRequestSuccess(dispatch, res);

        // set updated user data
        dispatch({
          type: Actions.SET_STATE,
          payload: { userData: res?.data.userData },
        });

        break;
      }

      case Actions.DO_LOGOUT: {
        await axios.post(`/api/logout`);

        // removing user data and auth, but keeping messages & auth state
        dispatch({
          type: Actions.CLEAR_DATA,
        });

        history.push("/");
        break;
      }
      default:
        return dispatch(action);
    }
  };

// Synchronous state changes
export const mainReducer = (state: MainState, action: Action): MainState => {
  switch (action.type) {
    case Actions.DELETE_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter((m) => m !== action.payload),
      };

    case Actions.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case Actions.SET_STATE:
      return { ...state, ...action.payload };
    case Actions.CLEAR_DATA:
      return {
        ...state,
        auth: AuthState.NOT_AUTHENTICATED,
        data: {},
        people: [],
        userData: {},
      };
    case Actions.SET_AUTH:
      return { ...state, auth: action.payload };
    default:
      return state;
  }
};

export const defaultMainState: MainState = {
  data: {},
  userData: {},
  auth: AuthState.WAITING,
  messages: [],
  people: [],
  authStrategies: [],
};
