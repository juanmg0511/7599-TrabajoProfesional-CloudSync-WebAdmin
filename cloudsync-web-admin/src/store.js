import { createStore } from 'redux'
import rootReducer from './reducers'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'cloudsync',
  storage,
  whitelist: ['auth']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = createStore(persistedReducer)

persistStore(store)
export default store
