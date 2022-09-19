import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_LOGOUT, SIDEBAR_ON, SIDEBAR_OFF, UNFOLDABLE_ON, UNFOLDABLE_OFF } from '../config.js'

const INITIAL_STATE = {
  sidebarShow: true,
  sidebarUnfoldable: false,
  authed: false,
  authing: true,
  token: ''
}

const auth = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case AUTH_REQUEST: {
      return {
        ...state,
        authing: true
      }
    }
    case AUTH_SUCCESS: {
      return {
        ...state,
        authed: true,
        authing: false,
        token: payload.token,
        username: payload.username
      }
    }
    case AUTH_LOGOUT: {
      return {
        ...state,
        sidebarShow: true,
        sidebarUnfoldable: false,
        authed: false,
        token: ''
      }
    }
    case SIDEBAR_ON: {
      return {
        ...state,
        sidebarShow: true
      }
    }
    case SIDEBAR_OFF: {
      return {
        ...state,
        sidebarShow: false
      }
    }
    case UNFOLDABLE_ON: {
      return {
        ...state,
        sidebarUnfoldable: true
      }
    }
    case UNFOLDABLE_OFF: {
      return {
        ...state,
        sidebarUnfoldable: false
      }
    }
    default: {
      return state
    }
  }
}

export default auth
