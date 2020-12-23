import to from "await-to-js";
import axios, { AxiosError, AxiosResponse } from "axios";

// use this to inspect axios requests
// axios.interceptors.request.use(request => {
//   console.log("Starting Request", request);
//   return request;
// });

// Some central error and success/message handlers
const handleRequestError = (dispatch, error: Error | null) => {
  if (!error) {
    return;
  }
  const castError = <AxiosError>error;
  dispatch({
    type: Actions.ADD_MESSAGE,
    payload: {
      error: true,
      msg: castError?.response?.data ?? "Something went wrong!",
    },
  });
  throw new Error(castError.response?.data ?? castError.response);
};

const handleRequestSuccess = (dispatch, res?: AxiosResponse) => {
  dispatch({
    type: Actions.ADD_MESSAGE,
    payload: { error: false, msg: res?.data?.msg ?? "Operation successful!" },
  });
};

// NOTE: you may want to make multiple reducers for more complex applications. Here, everything is lumped together for simplicity.

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

        if (data.openAuthenticatorEnabled) {
          // Contacting open-authenticator to fetch strategies.
          await middleware({
            type: Actions.DO_OPENAUTHENTICATOR_FETCH,
          });
        }

        dispatch({ type: Actions.SET_STATE, payload: newState });
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

export enum AuthState {
  AUTHENTICATING = `AUTHENTICATING`,
  AUTHENTICATED = `AUTHENTICATED`,
  NOT_AUTHENTICATED = `NOT_AUTHENTICATED`,
  WAITING = `WAITING`,
}

export enum Actions {
  REQUEST_AUTH = `REQUEST_AUTH`,
  SET_AUTH = `SET_AUTH`,
  SET_DATA = `SET_DATA`,
  CLEAR_DATA = `CLEAR_DATA`,
  ADD_MESSAGE = `ADD_MESSAGE`,
  DELETE_MESSAGE = `DELETE_MESSAGE`,
  SET_STATE = `SET_STATE`,
  DO_SESSION_FETCH = `DO_SESSION_FETCH`,
  DO_LOGOUT = `DO_LOGOUT`,
  DO_LOGIN = `DO_LOGIN`,
  DO_AUTH_UNLINK = `DO_AUTH_UNLINK`,
  DO_PASSWORD_CHANGE = `DO_PASSWORD_CHANGE`,
  DO_REGISTRATION = "DO_REGISTRATION",
  DO_OPENAUTHENTICATOR_FETCH = "DO_OPENAUTHENTICATOR_FETCH",
}

export interface Action {
  type: Actions;
  payload?: any;
}

export interface MainState {
  data: {};
  people: Person[];
  auth: AuthState;
  messages: Message[]; //TODO: type
  userData: any;
  authStrategies: string[]; // this is used if open-authenticator is being used.
}

export interface MainStore {
  dispatch: (action: Action) => Promise<any>;
  state: MainState;
  history: any;
}

export interface Message {
  error: boolean;
  msg: string;
}

// example data object - Person
export interface Person {
  name: string;
  email: string;
  contact: {
    phone: string;
    company: { name: string; catchPhrase: string };
    address: {
      streetA: string;
      streetB: string;
      city: string;
      state: string;
      zipcode: string;
    };
  };
}

export const defaultMainState: MainState = {
  data: {},
  userData: {},
  auth: AuthState.WAITING,
  messages: [],
  people: [],
  authStrategies: [],
};
