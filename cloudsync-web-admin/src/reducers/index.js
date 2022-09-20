import { combineReducers } from 'redux'
import auth from './auth'
import ui from './ui'

const rootReducer = combineReducers({
  auth, ui
})

export default rootReducer
