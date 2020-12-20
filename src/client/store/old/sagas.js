import { take, put } from "redux-saga/effects";
import axios from "axios";
import * as mutations from "./mutations";

export function* passwordChangeSaga(context) {
  while (true) {
    const { newPassword, oldPassword } = yield take(
      mutations.REQUEST_PASSWORD_CHANGE
    );
    try {
      const { data } = yield axios.post(`/api/changePassword`, {
        oldPassword,
        newPassword,
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
        toUnlink,
      });
      yield put(mutations.addMessage({ msg: data.msg, error: false }));
      yield put(mutations.setData(data.state));
    } catch (e) {
      yield put(mutations.addMessage({ msg: e.response.data, error: true }));
    }
  }
}
