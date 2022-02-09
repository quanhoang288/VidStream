import { combineReducers, createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunkMiddleware from 'redux-thunk';
import { authReducer, modalReducer, notificationReducer } from './reducers';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user'],
};

const notificationPersistConfig = {
  key: 'notification',
  storage,
};

const reducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  modal: modalReducer,
  notification: persistReducer(notificationPersistConfig, notificationReducer),
});

export const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export const persistor = persistStore(store);
