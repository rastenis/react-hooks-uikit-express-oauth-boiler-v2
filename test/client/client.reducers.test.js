import { reducer } from "../../src/client/store/reducer";
import * as mutations from "../../src/client/store/mutations";

import { isString } from "util";

// reducer tests
// tests to make sure mutation reducers work properly

describe("reducers -> data", () => {
  it("should return a default state with auth set as WAITING (for the session ping)", () => {
    expect(reducer(undefined, { type: mutations.SET_DATA })).toEqual({
      data: {},
      auth: mutations.WAITING,
      messages: []
    });
  });

  it("should return a modified state with given data set", () => {
    expect(
      reducer(undefined, { type: mutations.SET_DATA, data: { my: "data" } })
    ).toEqual({
      data: { my: "data" },
      auth: mutations.WAITING,
      messages: []
    });
  });

  it("should return a modified state with a cleared data object", () => {
    expect(
      reducer(
        {
          data: { my: "data" },
          auth: mutations.WAITING,
          messages: []
        },
        { type: mutations.CLEAR_DATA }
      )
    ).toEqual({
      data: {},
      auth: mutations.WAITING,
      messages: []
    });
  });
});

describe("reducers -> auth", () => {
  it("should return a default state with auth set as AUTHENTICATING ", () => {
    expect(reducer(undefined, { type: mutations.REQUEST_AUTH })).toEqual({
      data: {},
      auth: mutations.AUTHENTICATING,
      messages: []
    });
  });

  it("should return a modified state with given auth state", () => {
    expect(
      reducer(undefined, {
        type: mutations.PROCESSING_AUTH,
        authenticated: mutations.AUTHENTICATED
      })
    ).toEqual({
      data: {},
      auth: mutations.AUTHENTICATED,
      messages: []
    });
  });
});

describe("reducers -> messages", () => {
  it("should return a state with a newly created message with a generated id", () => {
    let m = reducer(undefined, {
      type: mutations.ADD_MESSAGE,
      msg: { msg: "Test message.", error: false }
    });

    expect(m.messages[0].msg).toEqual("Test message.");
    expect(m.messages[0].error).toEqual(false);
    // has a string id
    expect(isString(m.messages[0].id)).toEqual(true);
  });

  it("should return a state with the message deleted", () => {
    expect(
      reducer(
        {
          data: {},
          auth: mutations.WAITING,
          messages: [
            { msg: "I will be deleted.", error: false, id: "qqq" },
            { msg: "I will remain.", error: false, id: "bbb" }
          ]
        },
        {
          type: mutations.DELETE_MESSAGE,
          msg: { id: "qqq" }
        }
      )
    ).toEqual({
      data: {},
      auth: mutations.WAITING,
      messages: [{ msg: "I will remain.", error: false, id: "bbb" }]
    });
  });
});
