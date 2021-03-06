import { combineReducers } from 'redux';
import { HYDRATE } from 'next-redux-wrapper';
import snackbar from './snackbar';
import accounts from './accounts';
import categories from './categories';
import balance from './balance';
import expenses from './expenses';
import investment from './investment';
import transactions from './transactions';
import assets from './assets';
import trades from './trades';

const combinedReducer = combineReducers({
  snackbar,
	accounts,
	categories,
	balance,
	expenses,
	investment,
	transactions,
	assets,
	trades,
});

const reducer = (state, action) => {
	if (action.type === HYDRATE) {
		const nextState = {
			...state, // Use previous state
			...action.payload // Apply delta from hydration
		};

		if (state.snackbar) nextState.snackbar = state.snackbar;
		if (state.accounts) nextState.accounts = state.accounts;
		if (state.categories) nextState.categories = state.categories;
		if (state.balance) nextState.balance = state.balance;
		if (state.expenses) nextState.expenses = state.expenses;
		if (state.investment) nextState.investment = state.investment;
		if (state.transactions) nextState.transactions = state.transactions;
		if (state.assets) nextState.assets = state.assets;
		if (state.trades) nextState.trades = state.trades;

		return nextState;
	}

	return combinedReducer(state, action);
};

export default reducer;
