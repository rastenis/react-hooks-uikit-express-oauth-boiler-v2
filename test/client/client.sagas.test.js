jest.unmock("axios");
import MockAdapter from "axios-mock-adapter";
import { testSaga } from "redux-saga-test-plan";
import axios from "axios";
import * as sagas from "../../src/client/store/sagas";
import * as mutations from "../../src/client/store/mutations";
let mock;

axios.interceptors.request.use(request => {
  console.log("Starting Request", request);
  return request;
});

// saga tests
describe("sagas", () => {
  beforeAll(() => {
    mock = new MockAdapter(axios);
  });
  it("should perform an authentication saga", () => {
    // This sets the mock adapter on the default instance

    // Mock any post request to /api/auth
    // arguments for reply are (status, data, headers)
    // mock
    //   .onPost()
    //   .reply(200, { state: { testing: true }, people: [], msg: "Success!" });

    testSaga(sagas.authenticationSaga, {
      data: {},
      auth: "WAITING",
      messages: []
    })
      .next()
      .take(mutations.REQUEST_AUTH)
      .next({ email: "email", password: "password" })
      .next({ data: { state: { testing: true }, people: [], msg: "Success!" } })
      .put(mutations.setData({ testing: true }));
  });
});
