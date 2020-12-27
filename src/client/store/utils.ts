import { AxiosError, AxiosResponse } from "axios";
import { Actions } from "./types";

// use this to inspect axios requests
// axios.interceptors.request.use(request => {
//   console.log("Starting Request", request);
//   return request;
// });

// Some central error and success/message handlers
export const handleRequestError = (dispatch, error: Error | null) => {
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

export const handleRequestSuccess = (dispatch, res?: AxiosResponse) => {
  dispatch({
    type: Actions.ADD_MESSAGE,
    payload: { error: false, msg: res?.data?.msg ?? "Operation successful!" },
  });
};
