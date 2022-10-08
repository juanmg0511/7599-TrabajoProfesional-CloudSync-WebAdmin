import axios from 'axios'
import store from '../store.js'
import { APP_APPSERVER_BASE_URL } from '../config.js'
  
axios.interceptors.request.use(config => {
  config.headers['X-Admin'] = 'true'
  config.headers['X-Auth-Token'] = store.getState().auth.token
  return config
})


// Authentication
export function doAuth (user) {
    return axios.post(APP_APPSERVER_BASE_URL + '/api/v1/sessions', user)
}

export function doLogOut (sessionId) {
  return axios.delete(APP_APPSERVER_BASE_URL + `/api/v1/sessions/${sessionId}`)
}


// Password recovery
export function doRecoveryPassword (key, username, password) {
  return axios.post(APP_APPSERVER_BASE_URL + `/api/v1/recovery/${username}`, {
    recovery_key: key,
    new_password: password
  })
}


// Admin Users - Listing
export function getAdminUsers (show_closed, start, limit, user_filter) {
  let url = APP_APPSERVER_BASE_URL + `/api/v1/adminusers?show_closed=${show_closed}&start=${start}&limit=${limit}`
  if (user_filter) {
    url += `&user_filter=${user_filter}`
  }
  return axios.get(url)
}

export function getUserAdminSessions (username) {
  return axios.get(APP_APPSERVER_BASE_URL + `/api/v1/adminusers/${username}/sessions`)
}

export function removeAdminUser (username) {
  return axios.delete(APP_APPSERVER_BASE_URL + `/api/v1/adminusers/${username}`)
}

// Admin Users - Listing details and profile page
export function getAdminUser (username) {
  return axios.get(APP_APPSERVER_BASE_URL + `/api/v1/adminusers/${username}`)
}

export function doChangeAdminPassword (username, password) {
  return axios.patch(
    APP_APPSERVER_BASE_URL + `/api/v1/adminusers/${username}`,
    {
      op: 'replace',
      path: '/password',
      value: password
    }
  )
}

export function createAdminUser (user) {
  return axios.post(APP_APPSERVER_BASE_URL + '/api/v1/adminusers', user)
}

export function saveAdminUser (username, user) {
  return axios.put(APP_APPSERVER_BASE_URL + `/api/v1/adminusers/${username}`, user)
}




// Users - Listing
export function getUsers (show_closed, start, limit, user_filter) {
  let url = APP_APPSERVER_BASE_URL + `/api/v1/users?show_closed=${show_closed}&start=${start}&limit=${limit}`
  if (user_filter) {
    url += `&user_filter=${user_filter}`
  }
  return axios.get(url)
}

export function removeUser (username) {
  return axios.delete(APP_APPSERVER_BASE_URL + `/api/v1/users/${username}`)
}

// Users - Listing details
export function getUser (username) {
  return axios.get(APP_APPSERVER_BASE_URL + `/api/v1/users/${username}`)
}

export function saveUser (username, user) {
  return axios.put(APP_APPSERVER_BASE_URL + `/api/v1/users/${username}`, user)
}


// Request Log
export function getAppReqLog(server, lastWeek, today, reqid) {

  let serverEndpoint = (server == "AppServer" ? "requestlog" : "requestlogauthserver")
  let url = APP_APPSERVER_BASE_URL +
            `/api/v1/` + serverEndpoint +
            `?` +
            `startdate=${lastWeek}&` +
            `enddate=${today}&` +
            `filter={\"comparator\":\"eq\",\"field\":\"request_id\",\"value\":\"${reqid}\"}`
  
  return axios.get(url)
}

// Sessions - Listing
export function getSessions (start, limit, user_filter) {
  let url = APP_APPSERVER_BASE_URL + `/api/v1/sessions?start=${start}&limit=${limit}`
  if (user_filter) {
    url += `&user_filter=${user_filter}`
  }
  return axios.get(url)
}

export function removeSession (token) {
  return axios.delete(APP_APPSERVER_BASE_URL + `/api/v1/sessions/${token}`)
}

export function removeAllSessions () {
  return axios.delete(APP_APPSERVER_BASE_URL + `/api/v1/sessions`)
}


// Recovery - Listing
export function getRecoveries (start, limit, user_filter) {
  let url = APP_APPSERVER_BASE_URL + `/api/v1/recovery?start=${start}&limit=${limit}`
  if (user_filter) {
    url += `&user_filter=${user_filter}`
  }
  return axios.get(url)
}


// Game Progress - Listing
export function getGameProgress (start, limit, user_filter) {
  let url = APP_APPSERVER_BASE_URL + `/api/v1/gameprogress?start=${start}&limit=${limit}`
  if (user_filter) {
    url += `&user_filter=${user_filter}`
  }
  return axios.get(url)
}

export function removeGameProgress (id) {
  return axios.delete(APP_APPSERVER_BASE_URL + `/api/v1/gameprogress/${id}`)
}

// High Scores - Listing
export function getHighScores (start, limit, user_filter) {
  let url = APP_APPSERVER_BASE_URL + `/api/v1/highscores?start=${start}&limit=${limit}`
  if (user_filter) {
    url += `&user_filter=${user_filter}`
  }
  return axios.get(url)
}

export function removeHighScore (id) {
  return axios.delete(APP_APPSERVER_BASE_URL + `/api/v1/highscores/${id}`)
}
