import {
  SNACKBAR_CLOSE,
  SNACKBAR_SHOW_SUCCESS,
  SNACKBAR_SHOW_ERROR
} from '../actions/snackbar';

const initialState = {
  open: false,
  type: null,
  message: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SNACKBAR_CLOSE:
      return initialState;
    case SNACKBAR_SHOW_SUCCESS:
      return {
        ...state,
        open: true,
        type: 'success',
        message: action.payload
      };
    case SNACKBAR_SHOW_ERROR:
      return {
        ...state,
        open: true,
        type: 'error',
        message: action.payload
      };
    default:
      return state;
  }
};

export default reducer;
