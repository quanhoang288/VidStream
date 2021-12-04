import { combineReducers, createStore } from 'redux';
import { authReducer, modalReducer } from './reducers';

const reducer = combineReducers({
  auth: authReducer,
  modal: modalReducer,
});
const store = createStore(reducer);

export default store;
