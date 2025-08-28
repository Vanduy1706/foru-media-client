import { Fragment, useEffect, useRef, useState } from "react"
import { useNotification, useSetNotify } from "../../hooks/NotificationContext"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllMessage } from "../../apis/notification/getAllMessage"
import { markAllMessages } from "../../apis/notification/markAllMessages"
import NotificationCard from "../../components/NotificationCard"
import { useStatus } from "../../hooks/StatusContext"

export default function Notification() {
  const queryClient = useQueryClient()
  const { addStatus } = useStatus()

  const notificationList = useQuery({
    queryKey: ["notificationList"],
    queryFn: getAllMessage,
    retry: false,
    staleTime: 1000 * 30,
  })

  const markNotify = useMutation({
    mutationFn: markAllMessages,
    onSuccess: (data) => {
      queryClient.setQueryData(["notificationList"], (old) => {
        if (!old) return
        return []
      })
      addStatus("markAll")
    },
    onError: (error) => {},
  })

  if (notificationList.isPending) {
    return (
      <div className="w-full h-full bg-gray-50 flex justify-center m-4 dark:bg-gray-700">
        <div className="w-fit h-fit p-2 rounded-full bg-gray-50 drop-shadow-lg dark:bg-gray-600">
          <div className="spinner dark:spinner-dark"></div>
        </div>
      </div>
    )
  }

  if (notificationList.isError) {
    return (
      <div className="w-full h-full bg-gray-50 flex justify-center m-4 dark:bg-gray-700">
        <div className="w-fit h-fit p-2 rounded-md text-center bg-gray-50 drop-shadow-lg dark:bg-gray-600">
          <p>500</p>
          <p>Something wrong happened with the server</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full p-4 gap-4 flex flex-col">
      <div className="flex justify-between items-center">
        <p className="font-inter font-semibold text-xl text-gray-700 dark:text-gray-200">
          Notifications
        </p>
        <p
          className={`font-inter font-medium text-base italic  
          ${
            notificationList.data.length === 0
              ? "text-blue-200 cursor-not-allowed pointer-events-none dark:text-blue-800"
              : "underline text-blue-800 cursor-pointer dark:text-blue-200"
          }`}
          onClick={(e) => {
            e.preventDefault()
            markNotify.mutate()
          }}
        >
          Mark all
        </p>
      </div>
      <ul className="flex flex-col gap-2 overflow-y-auto">
        {notificationList.data.map((notify, i) => (
          <Fragment key={notify._id}>
            {!notify.isRead ? (
              <NotificationCard
                message={notify.message}
                fromAuthor={notify.fromAuthor.username}
                targetId={notify.targetId}
                targetType={notify.targetType}
                createdAt={notify.createdAt}
                key={notify._id}
              />
            ) : null}
          </Fragment>
        ))}
      </ul>
    </div>
  )
}
