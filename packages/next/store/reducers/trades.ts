import {
  TRADES_FETCH_START,
  TRADES_FETCH_SUCCESS,
  TRADES_FETCH_ERROR
} from '../actions/trades';

const initialState = {
  status: 'idle',
  records: [],
  error: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TRADES_FETCH_START:
      return {
        ...initialState,
        status: 'loading'
      };
    case TRADES_FETCH_SUCCESS:
      return {
        ...state,
        status: 'success',
        records: action.payload
      };
    case TRADES_FETCH_ERROR:
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
