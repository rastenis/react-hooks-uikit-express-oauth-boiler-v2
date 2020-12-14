import * as mutations from "../../src/client/store/mutations";

// mutation tests
// tests to make sure mutation creators work properly
// (needed if additional processing is done while creating mutations)

describe("mutations", () => {
  it("should create a mutation to create an account", () => {
    // reg data
    const email = "sample@email.com";
    const password = "password";

    const expectedRegisterMutation = {
      type: mutations.REQUEST_ACCOUNT_CREATION,
      email,
      password
    };
    expect(mutations.requestAccountCreation(email, password)).toEqual(
      expectedRegisterMutation
    );
  });

  it("should create a mutation to log user in", () => {
    // login data
    const email = "sample@email.com";
    const password = "password";

    const expectedLoginMutation = {
      type: mutations.REQUEST_AUTH,
      email,
      password
    };
    expect(mutations.requestAuth(email, password)).toEqual(
      expectedLoginMutation
    );
  });

  it("should create a mutation to alter auth", () => {
    // message content
    const auth = mutations.AUTHENTICATED;

    const expectedAuthMutation = {
      type: mutations.PROCESSING_AUTH,
      authenticated: mutations.AUTHENTICATED
    };
    expect(mutations.processAuth(auth)).toEqual(expectedAuthMutation);
  });

  it("should create a mutation to add a message", () => {
    // message content
    const message = { msg: "Test message.", error: false };

    const expectedAddMessageMutation = {
      type: mutations.ADD_MESSAGE,
      msg: message
    };

    expect(mutations.addMessage(message)).toEqual(expectedAddMessageMutation);
  });

  it("should create a mutation to delete a message", () => {
    const message = { msg: "Test message.", error: false, id: "123" };

    const expectedDeleteMessageMutation = {
      type: mutations.DELETE_MESSAGE,
      msg: message
    };
    expect(mutations.deleteMessage(message)).toEqual(
      expectedDeleteMessageMutation
    );
  });

  it("should create a mutation to change the user's password", () => {
    const o = "password";
    const n = "newPassword";

    const expectedPasswordChangeMutation = {
      type: mutations.REQUEST_PASSWORD_CHANGE,
      oldPassword: o,
      newPassword: n
    };

    expect(mutations.requestPasswordChange(o, n)).toEqual(
      expectedPasswordChangeMutation
    );
  });

  it("should create a mutation to unlink an auth provider", () => {
    const toUnlink = "google";

    const expectedAuthUnlinkMutation = {
      type: mutations.REQUEST_AUTH_UNLINK,
      toUnlink
    };
    expect(mutations.requestAuthUnlink(toUnlink)).toEqual(
      expectedAuthUnlinkMutation
    );
  });
});
