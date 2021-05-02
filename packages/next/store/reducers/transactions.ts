import moment from 'moment';
import {
  TRANSACTIONS_FETCH_START,
  TRANSACTIONS_FETCH_SUCCESS,
  TRANSACTIONS_FETCH_ERROR,
  TRANSACTIONS_SET_ACCOUNT
} from '../actions/transactions';

const initialState = {
  status: 'idle',
  records: [],
  error: null,
  dateFrom: moment().startOf('month'),
  dateTo: moment(),
  account: 'all'
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TRANSACTIONS_FETCH_START:
      return {
        ...initialState,
        status: 'loading',
        dateFrom: action.payload.dateFrom,
        dateTo: action.payload.dateTo,
        account: state.account
      };
    case TRANSACTIONS_FETCH_SUCCESS:
      return {
        ...state,
        status: 'success',
        records: action.payload
      };
    case TRANSACTIONS_FETCH_ERROR:
      return {
        ...state,
        status: 'error',
        error: action.payload
      };
    case TRANSACTIONS_SET_ACCOUNT:
      return {
        ...state,
        account: action.payload
      };
    default:
      return state;
  }
};

export default reducer;
