import { SET_ALERT, REMOVE_ALERT } from './actionTypes';
import { v4 as uuidv4 } from 'uuid';

export const setAlert = (msg, alertType) => dispatch => {
  const id = uuidv4();
  dispatch({
    type: SET_ALERT,
    payload: { id, alertType, msg },
  });

  setTimeout(
    () =>
      dispatch({
        type: REMOVE_ALERT,
        payload: id,
      }),
    2000
  );
};

export const removeAlert = id => dispatch => {
  dispatch({
    type: REMOVE_ALERT,
    payload: id,
  });
};
