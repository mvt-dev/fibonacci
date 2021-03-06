import {
  ASSETS_FETCH_START,
  ASSETS_FETCH_SUCCESS,
  ASSETS_FETCH_ERROR,
  ASSETS_REFRESH,
} from '../actions/assets';

const initialState = {
  status: 'idle',
  records: [],
  error: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ASSETS_FETCH_START:
      return {
        ...initialState,
        status: 'loading'
      };
    case ASSETS_FETCH_SUCCESS:
      return {
        ...state,
        status: 'success',
        records: action.payload
      };
    case ASSETS_FETCH_ERROR:
      return {
        ...state,
        status: 'error',
        error: action.payload
      };
    case ASSETS_REFRESH:
      return {
        ...state,
        status: 'idle',
      };
    default:
      return state;
  }
};

export default reducer;
