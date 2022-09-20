import { SIDEBAR_ON, SIDEBAR_OFF, UNFOLDABLE_ON, UNFOLDABLE_OFF } from '../config.js'

const INITIAL_STATE = {
  sidebarShow: true,
  sidebarUnfoldable: false,
}

const ui = (state = INITIAL_STATE, action) => {
  const { type } = action
  switch (type) {
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

export default ui
