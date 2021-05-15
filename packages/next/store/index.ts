import { createWrapper, MakeStore } from 'next-redux-wrapper';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import reducers from './reducers';

const makeStore: MakeStore = () => createStore(reducers, process.env.NEXT_PUBLIC_ENV !== 'production' ? composeWithDevTools(applyMiddleware(thunk)) : applyMiddleware(thunk));

export const wrapper = createWrapper(makeStore, {debug: process.env.NEXT_PUBLIC_ENV !== 'production'});
