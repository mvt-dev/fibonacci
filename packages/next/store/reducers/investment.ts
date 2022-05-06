import {
  INVESTMENT_FETCH_START,
  INVESTMENT_FETCH_SUCCESS,
  INVESTMENT_FETCH_ERROR,
  INVESTMENT_REFRESH,
} from '../actions/investment';

const initialState = {
  status: 'idle',
  records: [],
  error: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case INVESTMENT_FETCH_START:
      return {
        ...initialState,
        status: 'loading'
      };
    case INVESTMENT_FETCH_SUCCESS:
      return {
        ...state,
        status: 'success',
        records: action.payload
      };
    case INVESTMENT_FETCH_ERROR:
      return {
        ...state,
        status: 'error',
        error: action.payload
      };
    case INVESTMENT_REFRESH:
      return {
        ...state,
        status: 'idle',
      };
    default:
      return state;
  }
};

export default reducer;
