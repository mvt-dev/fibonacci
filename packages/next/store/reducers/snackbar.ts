import { SNACKBAR_SHOW_SUCCESS, SNACKBAR_CLOSE } from '../actions/snackbar';

const initialState = {
  open: false,
  type: null,
  message: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SNACKBAR_SHOW_SUCCESS:
      return {
        ...state,
        open: true,
        type: 'success',
        message: action.payload
      };
    case SNACKBAR_CLOSE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
