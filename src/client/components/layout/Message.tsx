import React, { Component, useEffect, useState } from "react";
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

  useEffect(() => {
    setLocalState({
      timeoutHandle: setTimeout(() => {
        store.dispatch({
          type: Actions.DELETE_MESSAGE,
          payload: props.message,
        });
      }, 3000),
    });
  }, []);

  const cancel = () => {
    clearTimeout(localState.timeoutHandle);
  };

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
