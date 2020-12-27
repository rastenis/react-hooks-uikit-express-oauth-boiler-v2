// This contains all of the types required for the store.

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
  messages: Message[];
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
