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

export function getFirstName (state) {
  return state.auth.first_name
}

export function getLastName (state) {
  return state.auth.last_name
}

export function getEmail (state) {
  return state.auth.email
}
