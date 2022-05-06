import { list } from '../../services/expensesService';

export const EXPENSES_FETCH_START = 'expenses/fetchStart';
const fetchStart = () => ({
  type: EXPENSES_FETCH_START
});

export const EXPENSES_FETCH_SUCCESS = 'expenses/fetchSuccess';
const fetchSuccess = data => ({
  type: EXPENSES_FETCH_SUCCESS,
  payload: data
});

export const EXPENSES_FETCH_ERROR = 'expenses/fetchError';
const fetchError = error => ({
  type: EXPENSES_FETCH_ERROR,
  payload: error
});

export const EXPENSES_REFRESH = 'expenses/refresh';
export const refresh = () => ({
  type: EXPENSES_REFRESH,
});

export const fetchExpenses = ({ force } = { force: false }) => async (dispatch, getState) => {
  const state = getState();
  if (force || state.expenses.status === 'idle') {
    dispatch(fetchStart());
    try {
      const response = await list();
      dispatch(fetchSuccess(response));
    } catch (error) {
      dispatch(fetchError(error.toString()));
    }
  }
}
