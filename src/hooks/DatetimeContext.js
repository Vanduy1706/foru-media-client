import { createContext, useContext } from "react"

const DatetimeContext = createContext(null)

export function DatetimeProvider({ children }) {
  function customDatetimeFormat(datetime) {
    const date = new Date(datetime)

    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Ho_Chi_Minh",
    }

    const formatter = new Intl.DateTimeFormat("vi-VN", options)

    return formatter.format(date)
  }
  return (
    <DatetimeContext value={customDatetimeFormat}>{children}</DatetimeContext>
  )
}

export function useFormatter() {
  return useContext(DatetimeContext)
}
