import { list } from '../../services/categoryService';

export const CATEGORIES_FETCH_START = 'categories/fetchStart';
const fetchStart = () => ({
  type: CATEGORIES_FETCH_START
});

export const CATEGORIES_FETCH_SUCCESS = 'categories/fetchSuccess';
const fetchSuccess = data => ({
  type: CATEGORIES_FETCH_SUCCESS,
  payload: data
});

export const CATEGORIES_FETCH_ERROR = 'categories/fetchError';
const fetchError = error => ({
  type: CATEGORIES_FETCH_ERROR,
  payload: error
});

export const fetchCategories = ({ force } = { force: false }) => async (dispatch, getState) => {
  const state = getState();
  if (force || state.categories.status === 'idle') {
    dispatch(fetchStart());
    try {
      const response = await list();
      dispatch(fetchSuccess(response));
    } catch (error) {
      dispatch(fetchError(error.toString()));
    }
  }
}
