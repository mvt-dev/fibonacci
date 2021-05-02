import {
  EXPENSES_FETCH_START,
  EXPENSES_FETCH_SUCCESS,
  EXPENSES_FETCH_ERROR
} from '../actions/expenses';

const initialState = {
  status: 'idle',
  records: [],
  error: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case EXPENSES_FETCH_START:
      return {
        ...initialState,
        status: 'loading'
      };
    case EXPENSES_FETCH_SUCCESS:
      return {
        ...state,
        status: 'success',
        records: action.payload
      };
    case EXPENSES_FETCH_ERROR:
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
