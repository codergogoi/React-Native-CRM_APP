import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import RootReducer from './reducers/index';

const initialState = {};

const middleware = [thunk];

const store = createStore(RootReducer, initialState, applyMiddleware(...middleware));

export default store;
