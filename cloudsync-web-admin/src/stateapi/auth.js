export function isAuthed (state) {
  return state.auth.authed
}

export function isAuthing (state) {
  return state.auth.authing
}

export function getToken (state) {
  return state.auth.token
}

export function getUsername (state) {
  return state.auth.username
}

export function getSidebarShow (state) {
  return state.auth.sidebarShow
}

export function getSidebarUnfoldable (state) {
  return state.auth.sidebarUnfoldable
}
