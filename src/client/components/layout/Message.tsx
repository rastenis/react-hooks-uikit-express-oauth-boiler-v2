import React, { Component, useState } from "react";
import { Actions } from "../../store";
import { MainContext } from "./ProviderWithRouter";

interface MessageProps {
  message: any;
}

export const Message = (props: MessageProps) => {
  const store = React.useContext(MainContext);

  // state for this component only
  const [localState, setLocalState] = useState({
    timeoutHandle: {} as NodeJS.Timeout,
  });

  const cancel = () => {
    setLocalState({
      timeoutHandle: setTimeout(() => {
        store.dispatch({
          type: Actions.DELETE_MESSAGE,
          payload: props.message.id,
        });
      }, 3000),
    });
  };

  clearTimeout(localState.timeoutHandle);

  return (
    <div
      className={`${
        props.message.error ? "uk-alert-danger" : "uk-alert-primary"
      }`}
      uk-alert="true"
    >
      <a className="uk-alert-close" uk-close="true" onClick={cancel} />
      <p>{props.message.msg}</p>
    </div>
  );
};
