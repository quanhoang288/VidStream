import { combineReducers, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authReducer, modalReducer } from './reducers';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user'],
};

const reducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  modal: modalReducer,
});

export const store = createStore(reducer);
export const persistor = persistStore(store);
