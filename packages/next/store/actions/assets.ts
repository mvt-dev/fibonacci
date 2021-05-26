import { list } from '../../services/assetService';

export const ASSETS_FETCH_START = 'asset/fetchStart';
const fetchStart = () => ({
  type: ASSETS_FETCH_START
});

export const ASSETS_FETCH_SUCCESS = 'asset/fetchSuccess';
const fetchSuccess = data => ({
  type: ASSETS_FETCH_SUCCESS,
  payload: data
});

export const ASSETS_FETCH_ERROR = 'asset/fetchError';
const fetchError = error => ({
  type: ASSETS_FETCH_ERROR,
  payload: error
});

export const fetchAssets = ({ force } = { force: false }) => async (dispatch, getState) => {
  const state = getState();
  if (force || state.assets.status === 'idle') {
    dispatch(fetchStart());
    try {
      const response = await list();
      dispatch(fetchSuccess(response));
    } catch (error) {
      dispatch(fetchError(error.toString()));
    }
  }
}
