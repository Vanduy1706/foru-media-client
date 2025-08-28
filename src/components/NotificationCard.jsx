import { NavLink } from "react-router"
import { useFormatter } from "../hooks/DatetimeContext"

export default function NotificationCard({
  message,
  fromAuthor,
  targetId,
  targetType,
  createdAt,
}) {
  const formatter = useFormatter()

  if (targetType === "speech") {
    return (
      <span className="w-full h-fit flex flex-row flex-wrap gap-1 p-3 bg-blue-200 rounded-md break-words dark:bg-blue-900">
        <div className="flex flex-row gap-1 flex-wrap">
          <p className="font-inter font-semibold text-blue-800 italic dark:text-blue-200">
            {fromAuthor}
          </p>
          <p className="font-inter font-medium text-gray-700 dark:text-gray-200">
            {message}
          </p>
          <p className="font-inter font-normal text-base text-gray-700 dark:text-gray-200">
            at {formatter(createdAt)}
          </p>
        </div>
        <NavLink to={`/home/speech/${targetId}`}>
          <p className="italic underline font-inter font-normal text-base text-gray-700 dark:text-gray-200">
            Click here to see detail
          </p>
        </NavLink>
      </span>
    )
  }

  if (targetType === "comment") {
    return (
      <span className="w-full h-fit flex flex-col flex-wrap gap-1 p-3 bg-blue-200 rounded-md break-words">
        <div className="flex flex-row gap-1 flex-wrap">
          <p className="font-inter font-semibold text-blue-800 italic">
            {fromAuthor}
          </p>
          <p className="font-inter font-medium text-gray-700">{message}</p>
          <p>at {formatter(createdAt)}</p>
        </div>
        <NavLink to={`/home/comment/${targetId}`}>
          <p className="italic underline">Click here to see detail</p>
        </NavLink>
      </span>
    )
  }

  return null
}
