import { combineReducers, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import { authReducer, modalReducer } from './reducers';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user'],
};

const rootPersistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
};

const reducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  modal: modalReducer,
});

const pReducer = persistReducer(rootPersistConfig, reducer);

export const store = createStore(pReducer);
export const persistor = persistStore(store);
