import { createStore, applyMiddleware, compose } from 'redux';
import reducers from '../reducers/index';
import thunkMiddleware from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist'
import storage from '@react-native-community/async-storage' // defaults to localStorage for web

const persistConfig = {
  key: 'root',
  storage,
  blacklist:['search','results'],
  timeout: null, // The code base checks for falsy, so 0 disables
}
const persistedReducer = persistReducer(persistConfig, reducers)
// const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ })

// export default function configureStore () {
  const enhancer = compose(
    applyMiddleware(
      // loggerMiddleware, // log chaque fois qu'un redux est rerendu (changement de page...)
      thunkMiddleware // permet les requetes asynchrones de redux (lecture firebase)
    )
  )
  let pReducer = createStore(persistedReducer, enhancer)


  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('../reducers/index').default
      pReducer.replaceReducer(nextRootReducer)
    })
  }
  export const store = pReducer;
  export const persistor = persistStore(store);
// }
