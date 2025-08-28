import { useQuery } from "@tanstack/react-query"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { getProfileUser } from "../apis/user/getProfile"
import { io } from "socket.io-client"

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const socketRef = useRef(null)

  const profile = useQuery({
    queryKey: ["profileUser"],
    queryFn: getProfileUser,
    retry: false,
  })

  useEffect(() => {
    if (profile.isSuccess && profile.data?._id) {
      socketRef.current = io(process.env.SERVER_URL, {
        query: { userId: String(profile.data._id) },
      })

      return () => {
        socketRef.current.disconnect()
      }
    }
  }, [profile.isSuccess, profile.data?._id])

  return (
    <NotificationContext.Provider value={socketRef.current}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  return useContext(NotificationContext)
}
