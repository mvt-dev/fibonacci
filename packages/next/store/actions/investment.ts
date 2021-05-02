import { listCurrent } from '../../services/investmentService';

export const INVESTMENT_FETCH_START = 'investment/fetchStart';
const fetchStart = () => ({
  type: INVESTMENT_FETCH_START
});

export const INVESTMENT_FETCH_SUCCESS = 'investment/fetchSuccess';
const fetchSuccess = data => ({
  type: INVESTMENT_FETCH_SUCCESS,
  payload: data
});

export const INVESTMENT_FETCH_ERROR = 'investment/fetchError';
const fetchError = error => ({
  type: INVESTMENT_FETCH_ERROR,
  payload: error
});

export const fetchInvestment = (force = false) => async (dispatch, getState) => {
  const state = getState();
  if (force || state.investment.status === 'idle') {
    dispatch(fetchStart());
    try {
      const response = await listCurrent();
      dispatch(fetchSuccess(response));
    } catch (error) {
      dispatch(fetchError(error.toString()));
    }
  }
}