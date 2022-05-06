import { list } from '../../services/transactionService';

export const TRANSACTIONS_FETCH_START = 'transactions/fetchStart';
const fetchStart = (dateFrom, dateTo) => ({
  type: TRANSACTIONS_FETCH_START,
  payload: { dateFrom, dateTo }
});

export const TRANSACTIONS_FETCH_SUCCESS = 'transactions/fetchSuccess';
const fetchSuccess = data => ({
  type: TRANSACTIONS_FETCH_SUCCESS,
  payload: data
});

export const TRANSACTIONS_FETCH_ERROR = 'transactions/fetchError';
const fetchError = error => ({
  type: TRANSACTIONS_FETCH_ERROR,
  payload: error
});

export const TRANSACTIONS_REFRESH = 'transactions/refresh';
export const refresh = () => ({
  type: TRANSACTIONS_REFRESH,
});

export const fetchTransactions = (props: { force?: boolean, dateFrom?: string, dateTo?: string }) => async (dispatch, getState) => {
  const { force = false, dateFrom = null, dateTo = null } = props;
  const { transactions } = getState();
  if (force || transactions.status === 'idle' || dateFrom !== transactions.dateFrom || dateTo !== transactions.dateTo) {
    const _dateFrom = dateFrom || transactions.dateFrom;
    const _dateTo = dateTo || transactions.dateTo;
    dispatch(fetchStart(_dateFrom, _dateTo));
    try {
      const response = await list(_dateFrom.format('YYYY-MM-DD'), _dateTo.format('YYYY-MM-DD'));
      dispatch(fetchSuccess(response));
    } catch (error) {
      dispatch(fetchError(error.toString()));
    }
  }
}

export const TRANSACTIONS_SET_ACCOUNT = 'transactions/setAccount';
export const setAccount = account => ({
  type: TRANSACTIONS_SET_ACCOUNT,
  payload: account
});
