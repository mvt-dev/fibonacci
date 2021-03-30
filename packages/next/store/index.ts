import { createWrapper, MakeStore } from 'next-redux-wrapper';
import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import reducers from './reducers';

const makeStore: MakeStore = () => createStore(reducers, devToolsEnhancer({}));

export const wrapper = createWrapper(makeStore, {debug: process.env.NEXT_PUBLIC_ENV !== 'production'});
