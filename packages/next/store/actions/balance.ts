import { list } from '../../services/balanceService';

export const BALANCE_FETCH_START = 'balance/fetchStart';
const fetchStart = () => ({
  type: BALANCE_FETCH_START
});

export const BALANCE_FETCH_SUCCESS = 'balance/fetchSuccess';
const fetchSuccess = data => ({
  type: BALANCE_FETCH_SUCCESS,
  payload: data
});

export const BALANCE_FETCH_ERROR = 'balance/fetchError';
const fetchError = error => ({
  type: BALANCE_FETCH_ERROR,
  payload: error
});

export const BALANCE_REFRESH = 'balance/refresh';
export const refresh = () => ({
  type: BALANCE_REFRESH,
});

export const fetchBalance = ({ force } = { force: false }) => async (dispatch, getState) => {
  const state = getState();
  if (force || state.balance.status === 'idle') {
    dispatch(fetchStart());
    try {
      const response = await list();
      dispatch(fetchSuccess(response));
    } catch (error) {
      dispatch(fetchError(error.toString()));
    }
  }
}
