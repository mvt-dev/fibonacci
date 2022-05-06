import { list } from '../../services/accountService';

export const ACCOUNTS_FETCH_START = 'accounts/fetchStart';
const fetchStart = () => ({
  type: ACCOUNTS_FETCH_START
});

export const ACCOUNTS_FETCH_SUCCESS = 'accounts/fetchSuccess';
const fetchSuccess = data => ({
  type: ACCOUNTS_FETCH_SUCCESS,
  payload: data
});

export const ACCOUNTS_FETCH_ERROR = 'accounts/fetchError';
const fetchError = error => ({
  type: ACCOUNTS_FETCH_ERROR,
  payload: error
});

export const ACCOUNTS_REFRESH = 'accounts/refresh';
export const refresh = () => ({
  type: ACCOUNTS_REFRESH,
});

export const fetchAccounts = ({ force } = { force: false }) => async (dispatch, getState) => {
  const state = getState();
  if (force || state.accounts.status === 'idle') {
    dispatch(fetchStart());
    try {
      const response = await list();
      dispatch(fetchSuccess(response));
    } catch (error) {
      dispatch(fetchError(error.toString()));
    }
  }
}
