export const SNACKBAR_CLOSE = 'SNACKBAR_CLOSE';
export const snackbarClose = () => ({
  type: SNACKBAR_CLOSE,
});

export const SNACKBAR_SHOW_SUCCESS = 'SNACKBAR_SHOW_SUCCESS';
export const snackbarShowSuccess = (message) => ({
  type: SNACKBAR_SHOW_SUCCESS,
  payload: message
});

export const SNACKBAR_SHOW_ERROR = 'SNACKBAR_SHOW_ERROR';
export const snackbarShowError = (message) => ({
  type: SNACKBAR_SHOW_ERROR,
  payload: message
});
