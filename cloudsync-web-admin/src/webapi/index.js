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

export function doAuthGetAdminDetails (username, session_token) {

  const uninterceptedAxiosInstance = axios.create();
  return uninterceptedAxiosInstance.get(APP_APPSERVER_BASE_URL + `/api/v1/adminusers/${username}`, {
    headers: {
      'X-Auth-Token': `${session_token}`
    }
  })
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
export function getAdminUsers (show_closed, start, limit, user_filter, sort_column, sort_order) {
  let url = APP_APPSERVER_BASE_URL + `/api/v1/adminusers?show_closed=${show_closed}&start=${start}&limit=${limit}`
  if (user_filter) {
    url += `&user_filter=${user_filter}`
  }
  if (sort_column) {
    url += `&sort_column=${sort_column}`
  }
  if (sort_order) {
    url += `&sort_order=${sort_order}`
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

export function removeAllAdminuserSessions (username) {
  return axios.delete(APP_APPSERVER_BASE_URL + `/api/v1/users/${username}/sessions`)
}


// Users - Listing
export function getUsers (show_closed, start, limit, user_filter, sort_column, sort_order) {
  let url = APP_APPSERVER_BASE_URL + `/api/v1/users?show_closed=${show_closed}&start=${start}&limit=${limit}`
  if (user_filter) {
    url += `&user_filter=${user_filter}`
  }
  if (sort_column) {
    url += `&sort_column=${sort_column}`
  }
  if (sort_order) {
    url += `&sort_order=${sort_order}`
  }
  return axios.get(url)
}

export function removeUser (username) {
  return axios.delete(APP_APPSERVER_BASE_URL + `/api/v1/users/${username}`)
}

// Users - Listing details and profile page
export function getUser (username) {
  return axios.get(APP_APPSERVER_BASE_URL + `/api/v1/users/${username}`)
}

export function doChangeUserPassword (username, password) {
  return axios.patch(
    APP_APPSERVER_BASE_URL + `/api/v1/users/${username}`,
    {
      op: 'replace',
      path: '/password',
      value: password
    }
  )
}

export function doChangeUserAvatar (username, avatar) {
  return axios.patch(
    APP_APPSERVER_BASE_URL + `/api/v1/users/${username}`,
    {
      op: 'replace',
      path: '/avatar',
      value: avatar
    }
  )
}

export function createUser (user) {
  return axios.post(APP_APPSERVER_BASE_URL + '/api/v1/users', user)
}

export function saveUser (username, user) {
  return axios.put(APP_APPSERVER_BASE_URL + `/api/v1/users/${username}`, user)
}

export function removeAllUserSessions (username) {
  return axios.delete(APP_APPSERVER_BASE_URL + `/api/v1/users/${username}/sessions`)
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
export function getSessions (start, limit, user_filter, sort_column, sort_order) {
  let url = APP_APPSERVER_BASE_URL + `/api/v1/sessions?start=${start}&limit=${limit}`
  if (user_filter) {
    url += `&user_filter=${user_filter}`
  }
  if (sort_column) {
    url += `&sort_column=${sort_column}`
  }
  if (sort_order) {
    url += `&sort_order=${sort_order}`
  }
  return axios.get(url)
}

export function removeSession (token) {
  return axios.delete(APP_APPSERVER_BASE_URL + `/api/v1/sessions/${token}`)
}

export function removeAllSessions () {
  return axios.delete(APP_APPSERVER_BASE_URL + `/api/v1/sessions`)
}

// Sessions - Listing details and profile page
export function getSession (user_filter) {
  let url = APP_APPSERVER_BASE_URL + `/api/v1/sessions?user_filter=${user_filter}`
  return axios.get(url)
}


// Recovery - Listing
export function getRecoveries (start, limit, user_filter, sort_column, sort_order) {
  let url = APP_APPSERVER_BASE_URL + `/api/v1/recovery?start=${start}&limit=${limit}`
  if (user_filter) {
    url += `&user_filter=${user_filter}`
  }
  if (sort_column) {
    url += `&sort_column=${sort_column}`
  }
  if (sort_order) {
    url += `&sort_order=${sort_order}`
  }
  return axios.get(url)
}

export function removeRecovery (user) {
  return axios.delete(APP_APPSERVER_BASE_URL + `/api/v1/recovery/${user}`)
}

// Recovery - Listing details and profile page
export function createRecovery (user) {
  return axios.post(APP_APPSERVER_BASE_URL + '/api/v1/recovery', user)
}

export function getRecovery (username) {
  return axios.get(APP_APPSERVER_BASE_URL + `/api/v1/recovery/${username}`)
}


// Game Progress - Listing
export function getAllGameProgress (start, limit, user_filter, sort_column, sort_order) {
  let url = APP_APPSERVER_BASE_URL + `/api/v1/gameprogress?start=${start}&limit=${limit}`
  if (user_filter) {
    url += `&user_filter=${user_filter}`
  }
  if (sort_column) {
    url += `&sort_column=${sort_column}`
  }
  if (sort_order) {
    url += `&sort_order=${sort_order}`
  }
  return axios.get(url)
}

export function removeGameProgress (id) {
  return axios.delete(APP_APPSERVER_BASE_URL + `/api/v1/gameprogress/${id}`)
}

// Game Progress - Listing details and profile page
export function createGameProgress (progress) {
  return axios.post(APP_APPSERVER_BASE_URL + '/api/v1/gameprogress', progress)
}

export function getGameProgress (id) {
  return axios.get(APP_APPSERVER_BASE_URL + `/api/v1/gameprogress/${id}`)
}

export function saveGameProgress (id, progress) {
  return axios.put(APP_APPSERVER_BASE_URL + `/api/v1/gameprogress/${id}`, progress)
}


// High Scores - Listing
export function getHighScores (start, limit, user_filter, sort_column, sort_order) {
  let url = APP_APPSERVER_BASE_URL + `/api/v1/highscores?start=${start}&limit=${limit}`
  if (user_filter) {
    url += `&user_filter=${user_filter}`
  }
  if (sort_column) {
    url += `&sort_column=${sort_column}`
  }
  if (sort_order) {
    url += `&sort_order=${sort_order}`
  }
  return axios.get(url)
}

export function removeHighScore (id) {
  return axios.delete(APP_APPSERVER_BASE_URL + `/api/v1/highscores/${id}`)
}

// High Scores - Listing details and profile page
export function createHighScore (highscore) {
  return axios.post(APP_APPSERVER_BASE_URL + '/api/v1/highscores', highscore)
}

export function getHighScore (id) {
  return axios.get(APP_APPSERVER_BASE_URL + `/api/v1/highscores/${id}`)
}

export function saveHighScore (id, highscore) {
  return axios.put(APP_APPSERVER_BASE_URL + `/api/v1/highscores/${id}`, highscore)
}
