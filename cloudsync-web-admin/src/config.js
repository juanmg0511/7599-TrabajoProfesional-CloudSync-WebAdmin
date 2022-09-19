const REACT_APP_ENV_DEFAULT = 'DEV'
const REACT_APP_APPSERVER_BASE_URL_DEFAULT = 'https://fiuba-qa-7599-cs-app-server.herokuapp.com'
const REACT_APP_AUTHERVER_BASE_URL_DEFAULT = 'https://fiuba-qa-7599-cs-auth-server.herokuapp.com'

export const REACT_APP_ENV = (process.env.APP_ENV ? process.env.APP_ENV : REACT_APP_ENV_DEFAULT)
export const REACT_APP_APPSERVER_BASE_URL = ( process.env.APP_APPSERVER_BASE_URL ? process.env.APP_APPSERVER_BASE_URL : REACT_APP_APPSERVER_BASE_URL_DEFAULT)
export const REACT_APP_AUTHSERVER_BASE_URL = ( process.env.APP_AUTHSERVER_BASE_URL ? process.env.APP_AUTHSERVER_BASE_URL : REACT_APP_AUTHERVER_BASE_URL_DEFAULT)

export const REACT_APP_QA_COLOR = '#F58A06'
export const REACT_APP_DEV_COLOR = '#228C22'

export const AUTH_REQUEST = 'AUTH_REQUEST'
export const AUTH_SUCCESS = 'AUTH_SUCCESS'
export const AUTH_LOGOUT = 'AUTH_LOGOUT'
export const SIDEBAR_ON = 'SIDEBAR_ON'
export const SIDEBAR_OFF = 'SIDEBAR_OFF'
export const UNFOLDABLE_ON = 'UNFOLDABLE_ON'
export const UNFOLDABLE_OFF = 'UNFOLDABLE_OFF'

export const UNDELETABLE_ADMIN_NAME = 'cloudsyndgod'
