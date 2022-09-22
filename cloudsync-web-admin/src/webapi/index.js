import axios from 'axios'
import store from '../store.js'
import { APP_APPSERVER_BASE_URL } from '../config.js'
  
axios.interceptors.request.use(config => {
  config.headers['X-Admin'] = 'true'
  config.headers['X-Auth-Token'] = store.getState().auth.token
  return config
})

export function doAuth (user) {
    return axios.post(APP_APPSERVER_BASE_URL + '/api/v1/sessions', user)
}

export function doLogOut (sessionId) {
  return axios.delete(APP_APPSERVER_BASE_URL + `/api/v1/sessions/${sessionId}`)
}

export function doRecoveryPassword (key, username, password) {
  return axios.post(APP_APPSERVER_BASE_URL + `/api/v1/recovery/${username}`, {
    recovery_key: key,
    new_password: password
  })
}

export function getUsers () {
  return axios.get(APP_APPSERVER_BASE_URL + '/api/v1/users')
}

export function getUser (username) {
  return axios.get(APP_APPSERVER_BASE_URL + `/api/v1/users/${username}`)
}

export function saveUser (username, user) {
  return axios.put(APP_APPSERVER_BASE_URL + `/api/v1/users/${username}`, user)
}

export function removeUser (username) {
  return axios.delete(APP_APPSERVER_BASE_URL + `/api/v1/users/${username}`)
}
