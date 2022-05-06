import {
  ACCOUNTS_FETCH_START,
  ACCOUNTS_FETCH_SUCCESS,
  ACCOUNTS_FETCH_ERROR,
  ACCOUNTS_REFRESH,
} from '../actions/accounts';

const initialState = {
  status: 'idle',
  records: [],
  error: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACCOUNTS_FETCH_START:
      return {
        ...initialState,
        status: 'loading'
      };
    case ACCOUNTS_FETCH_SUCCESS:
      return {
        ...state,
        status: 'success',
        records: action.payload
      };
    case ACCOUNTS_FETCH_ERROR:
      return {
        ...state,
        status: 'error',
        error: action.payload
      };
    case ACCOUNTS_REFRESH:
      return {
        ...state,
        status: 'idle',
      };
    default:
      return state;
  }
};

export default reducer;
