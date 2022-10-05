export function parseTimestamp(timestamp) {
    const date = new Date(timestamp)
    const utcDate = new Date(date.getTime() - (date.getTimezoneOffset()*60000))

  return utcDate.toUTCString()
}
