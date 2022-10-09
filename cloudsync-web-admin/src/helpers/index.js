import { defaultAvatarUrl } from '../config'

export function parseTimestamp(timestamp) {
    const date = new Date(timestamp)
    const utcDate = new Date(date.getTime() - (date.getTimezoneOffset()*60000))

  return utcDate.toUTCString()
}

export function getDefaulAvatartUrl(firstName, lastName) {

  return (
    defaultAvatarUrl
      .replace("FirstName", firstName.charAt(0).toUpperCase())
      .replace("LastName", lastName.charAt(0).toUpperCase())
  )
}
