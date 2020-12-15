import axios from "axios";

export const REQUEST_AUTH = `REQUEST_AUTH`;
export const PROCESSING_AUTH = `PROCESSING_AUTH`;
export const AUTHENTICATING = `AUTHENTICATING`;
export const AUTHENTICATED = `AUTHENTICATED`;
export const AUTH_ERROR = `AUTH_ERROR`;
export const SET_DATA = `SET_DATA`;
export const CLEAR_DATA = `CLEAR_DATA`;
export const ADD_MESSAGE = `ADD_MESSAGE`;
export const DELETE_MESSAGE = `DELETE_MESSAGE`;
export const REQUEST_ACCOUNT_CREATION = `REQUEST_ACCOUNT_CREATION`;
export const REQUEST_SESSION_FETCH = `REQUEST_SESSION_FETCH`;
export const REQUEST_LOGOUT = `REQUEST_LOGOUT`;
export const WAITING = `WAITING`;
export const REQUEST_AUTH_UNLINK = `REQUEST_AUTH_UNLINK`;
export const REQUEST_PASSWORD_CHANGE = `REQUEST_PASSWORD_CHANGE`;

export const requestAuth = (email, password) => ({
  type: REQUEST_AUTH,
  email,
  password,
});

export const processAuth = (status = AUTHENTICATING) => ({
  type: PROCESSING_AUTH,
  authenticated: status,
});

export const requestLogout = () => ({
  type: REQUEST_LOGOUT,
});

export const addMessage = (msg) => ({
  type: ADD_MESSAGE,
  msg: msg,
});

export const deleteMessage = (msg) => ({
  type: DELETE_MESSAGE,
  msg: msg,
});

export const setData = (data = {}) => ({
  type: SET_DATA,
  data,
});

export const clearData = () => ({
  type: CLEAR_DATA,
});

export const requestAccountCreation = (email, password) => ({
  type: REQUEST_ACCOUNT_CREATION,
  email,
  password,
});

export const requestPasswordChange = (oldPassword, newPassword) => ({
  type: REQUEST_PASSWORD_CHANGE,
  oldPassword,
  newPassword,
});

export const requestAuthUnlink = (toUnlink) => ({
  type: REQUEST_AUTH_UNLINK,
  toUnlink,
});

// this is for handling async actions, and then passiing the result on to the reducer, which is synchronous
export const mainReducerMiddleware = (dispatch) => async (action: Action) => {
  switch (action.type) {
    case Actions.REQUEST_SESSION_FETCH: {
      const { data } = await axios.get(`/api/data`);

      const newState: MainState = {
        data: {},
        userData: data.state.userData,
        people: data.state.people,
        auth: data.state.auth
          ? AuthState.AUTHENTICATED
          : AuthState.NOT_AUTHENTICATED,
        messages: [],
      };

      // register server side messages, if any
      if (data.message) {
        newState.messages.push(data.message);
      }

      dispatch({ type: Actions.SET_STATE, payload: newState });
    }
  }
};

export const mainReducer = (state: MainState, action: Action) => {
  switch (action.type) {
    case Actions.DELETE_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter((m) => m !== action.payload),
      };
    case Actions.SET_STATE:
      return action.payload;
    default:
      return state;
  }
};

export enum AuthState {
  PROCESSING = `PROCESSING`,
  AUTHENTICATING = `AUTHENTICATING`,
  AUTHENTICATED = `AUTHENTICATED`,
  NOT_AUTHENTICATED = `NOT_AUTHENTICATED`,
  WAITING = `WAITING`,
}

export enum Actions {
  REQUEST_AUTH = `REQUEST_AUTH`,
  PROCESSING_AUTH = `PROCESSING_AUTH`,
  AUTHENTICATING = `AUTHENTICATING`,
  AUTHENTICATED = `AUTHENTICATED`,
  AUTH_ERROR = `AUTH_ERROR`,
  SET_DATA = `SET_DATA`,
  CLEAR_DATA = `CLEAR_DATA`,
  ADD_MESSAGE = `ADD_MESSAGE`,
  DELETE_MESSAGE = `DELETE_MESSAGE`,
  SET_STATE = `SET_STATE`,
  REQUEST_ACCOUNT_CREATION = `REQUEST_ACCOUNT_CREATION`,
  REQUEST_SESSION_FETCH = `REQUEST_SESSION_FETCH`,
  REQUEST_LOGOUT = `REQUEST_LOGOUT`,
  DO_LOGIN = `DO_LOGIN`,
  DO_AUTH_UNLINK = `DO_AUTH_UNLINK`,
  DO_PASSWORD_CHANGE = `DO_PASSWORD_CHANGE`,
  DO_REGISTRATION = "DO_REGISTRATION",
  REQUEST_AUTH_UNLINK = `REQUEST_AUTH_UNLINK`,
  REQUEST_PASSWORD_CHANGE = `REQUEST_PASSWORD_CHANGE`,
}

export interface Action {
  type: Actions;
  payload: any;
}

export interface MainState {
  data: {};
  people: Person[];
  auth: AuthState;
  messages: Message[]; //TODO: type
  userData: any;
}

export interface Message {
  error: boolean;
  msg: string;
}

// example data object - Person
export interface Person {
  email: string;
  contact: {
    phone: string;
    company: string;
    address: {
      line1: string;
      line2: string;
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
};
