import { list } from '../../services/tradeService';

export const TRADES_FETCH_START = 'trades/fetchStart';
const fetchStart = () => ({
  type: TRADES_FETCH_START
});

export const TRADES_FETCH_SUCCESS = 'trades/fetchSuccess';
const fetchSuccess = data => ({
  type: TRADES_FETCH_SUCCESS,
  payload: data
});

export const TRADES_FETCH_ERROR = 'trades/fetchError';
const fetchError = error => ({
  type: TRADES_FETCH_ERROR,
  payload: error
});

export const fetchTrades = ({ force } = { force: false }) => async (dispatch, getState) => {
  const state = getState();
  if (force || state.trades.status === 'idle') {
    dispatch(fetchStart());
    try {
      const response = await list();
      dispatch(fetchSuccess(response));
    } catch (error) {
      dispatch(fetchError(error.toString()));
    }
  }
}
