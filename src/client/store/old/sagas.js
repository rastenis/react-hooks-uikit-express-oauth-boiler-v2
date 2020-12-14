import { take, put } from "redux-saga/effects";
import axios from "axios";
import * as mutations from "./mutations";

// use this to inspect axios requests
// axios.interceptors.request.use(request => {
//   console.log("Starting Request", request);
//   return request;
// });

export function* authenticationSaga(context) {
  while (true) {
    const { email, password } = yield take(mutations.REQUEST_AUTH);
    try {
      const { data } = yield axios.post(`/api/auth`, {
        email,
        password
      });
      yield put(mutations.setData(data.state));
      yield put(mutations.processAuth(mutations.AUTHENTICATED));
      yield put(mutations.addMessage({ msg: data.msg, error: false }));

      yield put({
        type: mutations.REQUEST_SESSION_FETCH
      });

      context.routerHistory.push("/");
    } catch (e) {
      // TODO: set error message
      yield put(mutations.processAuth(mutations.AUTH_ERROR));
      yield put(mutations.addMessage({ msg: e.response.data, error: true }));
    }
  }
}

export function* registrationSaga(context) {
  while (true) {
    const { email, password } = yield take(mutations.REQUEST_ACCOUNT_CREATION);
    try {
      const { data } = yield axios.post(`/api/register`, {
        email,
        password
      });
      yield put(mutations.setData(data.state));
      yield put(mutations.processAuth(mutations.AUTHENTICATED));
      yield put(mutations.addMessage({ msg: data.msg, error: false }));

      context.routerHistory.push("/");
    } catch (e) {
      // TODO: set error message
      console.log(e);
      yield put(mutations.processAuth(mutations.AUTH_ERROR));
      yield put(mutations.addMessage({ msg: e.response.data, error: true }));
    }
  }
}

export function* passwordChangeSaga(context) {
  while (true) {
    const { newPassword, oldPassword } = yield take(
      mutations.REQUEST_PASSWORD_CHANGE
    );
    try {
      const { data } = yield axios.post(`/api/changePassword`, {
        oldPassword,
        newPassword
      });
      yield put(mutations.addMessage({ msg: data.msg, error: false }));
    } catch (e) {
      yield put(mutations.addMessage({ msg: e.response.data, error: true }));
    }
  }
}
export function* authUnlinkSaga(context) {
  while (true) {
    const { toUnlink } = yield take(mutations.REQUEST_AUTH_UNLINK);
    try {
      const { data } = yield axios.post(`/api/unlink`, {
        toUnlink
      });
      yield put(mutations.addMessage({ msg: data.msg, error: false }));
      yield put(mutations.setData(data.state));
    } catch (e) {
      yield put(mutations.addMessage({ msg: e.response.data, error: true }));
    }
  }
}

export function* sessionFetchSaga(context) {
  while (true) {
    yield take(mutations.REQUEST_SESSION_FETCH);
    try {
      const { data } = yield axios.get(`/api/data`);
      yield put(mutations.setData(data.state));
      yield put(
        mutations.processAuth(data.auth ? mutations.AUTHENTICATED : null)
      );

      // register server side messages, if any
      if (Object.keys(data.message || {}).length > 0) {
        yield put(mutations.addMessage(data.message));
      }
      context.routerHistory.push("/");
    } catch (e) {
      // no conncetion to backend
    }
  }
}

export function* logoutSaga(context) {
  while (true) {
    yield take(mutations.REQUEST_LOGOUT);
    try {
      yield axios.post(`/api/logout`);
      yield put(mutations.clearData()); // removing user data, but keeping messages & auth state
      yield put(mutations.processAuth(null));
      context.routerHistory.push("/");
    } catch (e) {}
  }
}
