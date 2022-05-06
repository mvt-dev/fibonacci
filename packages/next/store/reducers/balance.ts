import {
  BALANCE_FETCH_START,
  BALANCE_FETCH_SUCCESS,
  BALANCE_FETCH_ERROR,
  BALANCE_REFRESH,
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
    case BALANCE_REFRESH:
      return {
        ...state,
        status: 'idle',
      };
    default:
      return state;
  }
};

export default reducer;
