import axios from 'axios'
import store from '../store.js'
import { REACT_APP_APPSERVER_BASE_URL } from '../config.js'
  
axios.interceptors.request.use(config => {
  config.headers['X-Admin'] = 'true'
  config.headers['X-Auth-Token'] = store.getState().auth.token
  return config
})

export function doAuth (user) {
    return axios.post(REACT_APP_APPSERVER_BASE_URL + '/api/v1/sessions', user)
}

export function doLogOut (sessionId) {
  return axios.delete(REACT_APP_APPSERVER_BASE_URL + '/api/v1/sessions/${sessionId}')
}
