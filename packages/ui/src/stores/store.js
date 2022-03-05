import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import rootReducer from './reducer'

const configureStore = (env) => {
  let store
  if (env !== 'production') {
    store = createStore(
      rootReducer,
      composeWithDevTools(applyMiddleware(thunk))
    )
  } else {
    store = createStore(rootReducer, applyMiddleware(thunk))
  }
  return store
}

export default configureStore
