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
  return axios.delete(REACT_APP_APPSERVER_BASE_URL + `/api/v1/sessions/${sessionId}`)
}

export function doRecoveryPassword (key, username, password) {
  return axios.post(REACT_APP_APPSERVER_BASE_URL + `/api/v1/recovery/${username}`, {
    recovery_key: key,
    new_password: password
  })
}

export function getUsers () {
  return axios.get(REACT_APP_APPSERVER_BASE_URL + '/api/v1/users')
}

export function getUser (username) {
  return axios.get(REACT_APP_APPSERVER_BASE_URL + `/api/v1/users/${username}`)
}

export function saveUser (username, user) {
  return axios.put(REACT_APP_APPSERVER_BASE_URL + `/api/v1/users/${username}`, user)
}

export function removeUser (username) {
  return axios.delete(REACT_APP_APPSERVER_BASE_URL + `/api/v1/users/${username}`)
}
