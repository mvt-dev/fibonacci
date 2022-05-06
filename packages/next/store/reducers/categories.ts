import {
  CATEGORIES_FETCH_START,
  CATEGORIES_FETCH_SUCCESS,
  CATEGORIES_FETCH_ERROR,
  CATEGORIES_REFRESH,
} from '../actions/categories';

const initialState = {
  status: 'idle',
  records: [],
  error: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CATEGORIES_FETCH_START:
      return {
        ...initialState,
        status: 'loading'
      };
    case CATEGORIES_FETCH_SUCCESS:
      return {
        ...state,
        status: 'success',
        records: action.payload
      };
    case CATEGORIES_FETCH_ERROR:
      return {
        ...state,
        status: 'error',
        error: action.payload
      };
    case CATEGORIES_REFRESH:
      return {
        ...state,
        status: 'idle',
      };
    default:
      return state;
  }
};

export default reducer;
