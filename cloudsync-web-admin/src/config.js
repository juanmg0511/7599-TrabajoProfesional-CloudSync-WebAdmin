const REACT_APP_ENV_DEFAULT = 'DEV'
const REACT_APP_APPSERVER_BASE_URL_DEFAULT = 'https://fiuba-qa-7599-cs-app-server.herokuapp.com'

export const APP_ENV = (process.env.REACT_APP_ENV ? process.env.REACT_APP_ENV : REACT_APP_ENV_DEFAULT)
export const APP_APPSERVER_BASE_URL = ( process.env.REACT_APP_APPSERVER_BASE_URL ? process.env.REACT_APP_APPSERVER_BASE_URL : REACT_APP_APPSERVER_BASE_URL_DEFAULT)

export const APP_QA_COLOR = '#F58A06'
export const APP_DEV_COLOR = '#228C22'

export const AUTH_REQUEST = 'AUTH_REQUEST'
export const AUTH_SUCCESS = 'AUTH_SUCCESS'
export const AUTH_LOGOUT = 'AUTH_LOGOUT'
export const SIDEBAR_ON = 'SIDEBAR_ON'
export const SIDEBAR_OFF = 'SIDEBAR_OFF'
export const UNFOLDABLE_ON = 'UNFOLDABLE_ON'
export const UNFOLDABLE_OFF = 'UNFOLDABLE_OFF'

export const PAGE_SIZES = [10, 25, 50, 75, 100]

export const UNDELETABLE_ADMIN_NAME = 'cloudsyncgod'

// Field validation regular expressions
export const guidRegex = /^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/
export const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/

export const usernameRegex = /^[a-zA-Z0-9_.]+$/
export const nameRegex = /(.|\s)*\S(.|\s)*/
export const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
export const levelRegex = /^[1-9]|10$/
export const timeElapsedRegex = /^(?:(?:([0-9]{2,}):)?([0-5]?\d):)?([0-5]?\d)(\.(\d{3}))$/
export const scoreRegex = /^[0-9]*[1-9][0-9]*$/

// Defaults for avatars
// Size, in KB
export const defaultAvatarSize = 512
// Size, in pixels
export const defaultAvatarWidth = 256
export const defaultAvatarHeight = 256
// Url for default avatar
export const defaultAvatarUrl = "https://ui-avatars.com/api/?name=FirstName+LastName&background=321FDB&color=FFFFFF&size=512"
