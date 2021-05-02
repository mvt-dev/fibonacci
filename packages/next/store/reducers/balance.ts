import {
  BALANCE_FETCH_START,
  BALANCE_FETCH_SUCCESS,
  BALANCE_FETCH_ERROR
} from '../actions/balance';

const initialState = {
  status: 'idle',
  records: [],
  error: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case BALANCE_FETCH_START:
      return {
        ...initialState,
        status: 'loading'
      };
    case BALANCE_FETCH_SUCCESS:
      return {
        ...state,
        status: 'success',
        records: action.payload
      };
    case BALANCE_FETCH_ERROR:
      return {
        ...state,
        status: 'error',
        error: action.payload
      };
    default:
      return state;
  }
};

export default reducer;
