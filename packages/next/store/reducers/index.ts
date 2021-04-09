import { combineReducers } from 'redux';
import { HYDRATE } from 'next-redux-wrapper';
import snackbar from './snackbar';

const combinedReducer = combineReducers({
  snackbar,
});

const reducer = (state, action) => {
	if (action.type === HYDRATE) {
		const nextState = {
			...state, // Use previous state
			...action.payload // Apply delta from hydration
		};

		if (state.snackbar) nextState.snackbar = state.snackbar;

		return nextState;
	}

	return combinedReducer(state, action);
};

export default reducer;
