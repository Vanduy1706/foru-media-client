import { useEffect, useState } from "react"
import Option from "../../components/Option"
import { logout } from "../../apis/auth/logout"
import { useNavigate } from "react-router"
import { useNotification } from "../../hooks/NotificationContext"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllMessage } from "../../apis/notification/getAllMessage"
import { useTheme } from "../../hooks/ThemeContext"

export default function Menu() {
  const path = window.location.pathname
  const navigation = useNavigate()
  const [options, setOptions] = useState(path)
  const queryClient = useQueryClient()
  const socket = useNotification()
  const { theme, toggleTheme } = useTheme()

  const notificationList = useQuery({
    queryKey: ["notificationList"],
    queryFn: getAllMessage,
    retry: false,
    staleTime: 1000 * 30,
  })

  async function logoutHandler() {
    const res = await logout()

    navigation(res.redirectTo)
  }

  useEffect(() => {
    setOptions(path)
  }, [path])

  useEffect(() => {
    if (!socket) return
    socket.on("notification", (data) => {
      queryClient.setQueryData(["notificationList"], (old) => {
        if (!old) return
        return [data, ...old]
      })
    })
    // socket.on("commentNotification", (data) => {
    //   queryClient.setQueryData(["notificationList"], (old) => {
    //     if (!old) return
    //     return [data, ...old]
    //   })
    // })
    // socket.on("replyNotification", (data) => {
    //   queryClient.setQueryData(["notificationList"], (old) => {
    //     if (!old) return
    //     return [data, ...old]
    //   })
    // })
    return () => socket.off("voteNotification")
  }, [socket])

  return (
    <nav className="w-full h-full py-4 bg-gray-50 flex flex-col gap-2 dark:bg-gray-700">
      <Option path={"/home"}>
        <div
          className={`flex flex-row gap-2 items-center justify-center p-4 hover:bg-blue-100 dark:hover:bg-blue-700 ${
            options === "/home" ? "bg-blue-100 dark:bg-blue-700" : ""
          } md:justify-start`}
          onClick={(e) => {
            setOptions("/home")
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="18"
            viewBox="0 0 24 22"
            fill="none"
          >
            <path
              d="M11.8672 1.63617C11.9449 1.57512 12.0551 1.57512 12.1328 1.63617L21.6543 9.11761C21.8139 9.24343 21.7249 9.50043 21.5215 9.50043H19.7139C18.8856 9.50065 18.2139 10.1721 18.2139 11.0004V20.4282C18.2139 20.5465 18.1183 20.643 18 20.643H6C5.88165 20.643 5.78613 20.5465 5.78613 20.4282V11.0004C5.78613 10.1721 5.11437 9.50065 4.28613 9.50043H2.47852C2.27514 9.50043 2.1861 9.24343 2.3457 9.11761L11.8672 1.63617Z"
              fill="none"
              stroke={`${theme === "light" ? "#374151" : "#e5e7eb"}`}
              stroke-width="1.28571"
            />
            <mask id="path-2-inside-1_42_94" fill="white">
              <rect x="9" y="11" width="6" height="8" rx="0.857143" />
            </mask>
            <rect
              x="9"
              y="11"
              width="6"
              height="8"
              rx="0.857143"
              fill="#F9FAFB"
              stroke={`${theme === "light" ? "#374151" : "#e5e7eb"}`}
              stroke-width="2.57143"
              mask="url(#path-2-inside-1_42_94)"
            />
          </svg>
          <p className="font-inter font-semibold text-gray-700 hidden md:inline-block dark:text-gray-200">
            Home
          </p>
        </div>
      </Option>
      <Option path={"/home/profile"}>
        <div
          className={`flex flex-row gap-2 items-center justify-center p-4 hover:bg-blue-100 dark:hover:bg-blue-700 ${
            options === "/home/profile" ? "bg-blue-100 dark:bg-blue-700" : ""
          } md:justify-start`}
          onClick={(e) => {
            setOptions("/home/profile")
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <mask id="path-1-inside-1_48_97" fill="white">
              <path d="M12 12C15.1826 12 18.2349 13.2642 20.4854 15.5146C22.7358 17.7651 24 20.8174 24 24H0C4.80559e-07 20.8174 1.26421 17.7651 3.51465 15.5146C5.76508 13.2642 8.8174 12 12 12ZM12 0C14.7614 0 17 2.23858 17 5C17 7.76142 14.7614 10 12 10C9.23858 10 7 7.76142 7 5C7 2.23858 9.23858 0 12 0Z" />
            </mask>
            <path
              d="M12 12C15.1826 12 18.2349 13.2642 20.4854 15.5146C22.7358 17.7651 24 20.8174 24 24H0C4.80559e-07 20.8174 1.26421 17.7651 3.51465 15.5146C5.76508 13.2642 8.8174 12 12 12ZM12 0C14.7614 0 17 2.23858 17 5C17 7.76142 14.7614 10 12 10C9.23858 10 7 7.76142 7 5C7 2.23858 9.23858 0 12 0Z"
              fill="none"
            />
            <path
              d="M12 12L12 10.5H12L12 12ZM20.4854 15.5146L21.546 14.454L21.546 14.454L20.4854 15.5146ZM24 24V25.5H25.5V24H24ZM0 24L-1.5 24L-1.5 25.5H0V24ZM3.51465 15.5146L2.45399 14.454L2.45399 14.454L3.51465 15.5146ZM12 12L12 13.5C14.7848 13.5 17.4556 14.6062 19.4247 16.5753L20.4854 15.5146L21.546 14.454C19.0142 11.9222 15.5804 10.5 12 10.5L12 12ZM20.4854 15.5146L19.4247 16.5753C21.3938 18.5444 22.5 21.2152 22.5 24H24H25.5C25.5 20.4196 24.0778 16.9858 21.546 14.454L20.4854 15.5146ZM24 24V22.5H0V24V25.5H24V24ZM0 24L1.5 24C1.5 21.2152 2.6062 18.5444 4.57531 16.5753L3.51465 15.5146L2.45399 14.454C-0.077775 16.9858 -1.5 20.4196 -1.5 24L0 24ZM3.51465 15.5146L4.57531 16.5753C6.54442 14.6062 9.2152 13.5 12 13.5L12 12L12 10.5C8.41961 10.5 4.98575 11.9222 2.45399 14.454L3.51465 15.5146ZM12 0V1.5C13.933 1.5 15.5 3.067 15.5 5H17H18.5C18.5 1.41015 15.5899 -1.5 12 -1.5V0ZM17 5H15.5C15.5 6.933 13.933 8.5 12 8.5V10V11.5C15.5899 11.5 18.5 8.58985 18.5 5H17ZM12 10V8.5C10.067 8.5 8.5 6.933 8.5 5H7H5.5C5.5 8.58985 8.41015 11.5 12 11.5V10ZM7 5H8.5C8.5 3.067 10.067 1.5 12 1.5V0V-1.5C8.41015 -1.5 5.5 1.41015 5.5 5H7Z"
              fill={`${theme === "light" ? "#374151" : "#e5e7eb"}`}
              mask="url(#path-1-inside-1_48_97)"
            />
          </svg>
          <p className="font-inter font-semibold text-gray-700 hidden md:inline-block dark:text-gray-200">
            Profile
          </p>
        </div>
      </Option>
      <Option path={"/home/speech"}>
        <div
          className={`flex flex-row gap-2 items-center justify-center p-4 hover:bg-blue-100 dark:hover:bg-blue-700 ${
            options === "/home/speech" ? "bg-blue-100 dark:bg-blue-700" : ""
          } md:justify-start`}
          onClick={(e) => {
            setOptions("/home/speech")
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="20"
            viewBox="0 0 22 20"
            fill="none"
          >
            <mask id="path-1-inside-1_48_165" fill="white">
              <path d="M8.39258 0C9.49715 0 10.3926 0.895431 10.3926 2C10.3926 2.33827 10.3074 2.65622 10.1592 2.93555L10.4854 3.5L13.3057 8.38477L18.8633 5.05078C20.1963 4.25095 21.8926 5.21201 21.8926 6.7666V17.5C21.8926 18.6046 20.9971 19.5 19.8926 19.5H2.00293C-0.0252781 19.4999 -0.765228 16.8289 0.973633 15.7852L11.5898 9.41406L8.75293 4.5L8.46191 3.99609C8.43891 3.99688 8.41577 4 8.39258 4C7.28807 3.99993 6.39258 3.10452 6.39258 2C6.39258 0.895477 7.28807 7.47301e-05 8.39258 0Z" />
            </mask>
            <path
              d="M8.39258 0C9.49715 0 10.3926 0.895431 10.3926 2C10.3926 2.33827 10.3074 2.65622 10.1592 2.93555L10.4854 3.5L13.3057 8.38477L18.8633 5.05078C20.1963 4.25095 21.8926 5.21201 21.8926 6.7666V17.5C21.8926 18.6046 20.9971 19.5 19.8926 19.5H2.00293C-0.0252781 19.4999 -0.765228 16.8289 0.973633 15.7852L11.5898 9.41406L8.75293 4.5L8.46191 3.99609C8.43891 3.99688 8.41577 4 8.39258 4C7.28807 3.99993 6.39258 3.10452 6.39258 2C6.39258 0.895477 7.28807 7.47301e-05 8.39258 0Z"
              fill="none"
            />
            <path
              d="M8.39258 0L8.39258 -1L8.39251 -1L8.39258 0ZM10.1592 2.93555L9.27587 2.46676L9.01614 2.95616L9.29334 3.43587L10.1592 2.93555ZM10.4854 3.5L11.3514 2.99999L11.3512 2.99967L10.4854 3.5ZM13.3057 8.38477L12.4396 8.88478L12.9481 9.76541L13.8201 9.2423L13.3057 8.38477ZM18.8633 5.05078L19.3777 5.90831L19.3778 5.90827L18.8633 5.05078ZM2.00293 19.5L2.00287 20.5H2.00293V19.5ZM0.973633 15.7852L0.459056 14.9277L0.458978 14.9278L0.973633 15.7852ZM11.5898 9.41406L12.1044 10.2715L12.9475 9.76558L12.4559 8.91409L11.5898 9.41406ZM8.75293 4.5L9.61897 4.00003L9.61889 3.99989L8.75293 4.5ZM8.46191 3.99609L9.32788 3.49598L9.02772 2.97625L8.42789 2.99667L8.46191 3.99609ZM8.39258 4L8.39251 5H8.39258V4ZM8.39258 0V1C8.94486 1 9.39258 1.44772 9.39258 2H10.3926H11.3926C11.3926 0.343146 10.0494 -1 8.39258 -1V0ZM10.3926 2H9.39258C9.39258 2.16814 9.35068 2.3258 9.27587 2.46676L10.1592 2.93555L11.0425 3.40434C11.2642 2.98664 11.3926 2.50839 11.3926 2H10.3926ZM10.1592 2.93555L9.29334 3.43587L9.61952 4.00033L10.4854 3.5L11.3512 2.99967L11.025 2.43522L10.1592 2.93555ZM10.4854 3.5L9.61933 4.00001L12.4396 8.88478L13.3057 8.38477L14.1717 7.88475L11.3514 2.99999L10.4854 3.5ZM13.3057 8.38477L13.8201 9.2423L19.3777 5.90831L18.8633 5.05078L18.3489 4.19325L12.7912 7.52723L13.3057 8.38477ZM18.8633 5.05078L19.3778 5.90827C20.0438 5.50865 20.8926 5.98873 20.8926 6.7666H21.8926H22.8926C22.8926 4.43529 20.3489 2.99325 18.3488 4.19329L18.8633 5.05078ZM21.8926 6.7666H20.8926V17.5H21.8926H22.8926V6.7666H21.8926ZM21.8926 17.5H20.8926C20.8926 18.0523 20.4449 18.5 19.8926 18.5V19.5V20.5C21.5494 20.5 22.8926 19.1569 22.8926 17.5H21.8926ZM19.8926 19.5V18.5H2.00293V19.5V20.5H19.8926V19.5ZM2.00293 19.5L2.00299 18.5C0.98884 18.4999 0.618939 17.1644 1.48829 16.6426L0.973633 15.7852L0.458978 14.9278C-2.1494 16.4934 -1.0394 20.4998 2.00287 20.5L2.00293 19.5ZM0.973633 15.7852L1.48821 16.6426L12.1044 10.2715L11.5898 9.41406L11.0753 8.55662L0.459056 14.9277L0.973633 15.7852ZM11.5898 9.41406L12.4559 8.91409L9.61897 4.00003L8.75293 4.5L7.88689 4.99997L10.7238 9.91403L11.5898 9.41406ZM8.75293 4.5L9.61889 3.99989L9.32788 3.49598L8.46191 3.99609L7.59595 4.4962L7.88697 5.00011L8.75293 4.5ZM8.46191 3.99609L8.42789 2.99667C8.40578 2.99743 8.3871 2.99862 8.37494 2.99947C8.36876 2.9999 8.3633 3.00031 8.35957 3.0006C8.35774 3.00074 8.35586 3.00088 8.35464 3.00098C8.35324 3.00109 8.35232 3.00116 8.35153 3.00122C8.34782 3.0015 8.3513 3.0012 8.35736 3.00088C8.36384 3.00054 8.37627 3 8.39258 3V4V5C8.44528 5 8.48967 4.99649 8.50311 4.99546C8.50563 4.99527 8.51232 4.99476 8.51239 4.99475C8.51444 4.99459 8.51475 4.99457 8.51434 4.9946C8.51371 4.99465 8.50655 4.99515 8.49594 4.99551L8.46191 3.99609ZM8.39258 4L8.39265 3C7.8403 2.99996 7.39258 2.55217 7.39258 2H6.39258H5.39258C5.39258 3.65688 6.73584 4.99989 8.39251 5L8.39258 4ZM6.39258 2H7.39258C7.39258 1.44783 7.8403 1.00004 8.39265 1L8.39258 0L8.39251 -1C6.73584 -0.999888 5.39258 0.343124 5.39258 2H6.39258Z"
              fill={`${theme === "light" ? "#374151" : "#e5e7eb"}`}
              mask="url(#path-1-inside-1_48_165)"
            />
          </svg>
          <p className="font-inter font-semibold text-gray-700 hidden md:inline-block dark:text-gray-200">
            Speech
          </p>
        </div>
      </Option>
      <Option path={"/home/bookmark"}>
        <div
          className={`flex flex-row gap-2 items-center justify-center p-4 hover:bg-blue-100 dark:hover:bg-blue-700 ${
            options === "/home/bookmark" ? "bg-blue-100 dark:bg-blue-700" : ""
          } md:justify-start`}
          onClick={(e) => {
            setOptions("/home/bookmark")
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="23"
            viewBox="0 0 18 23"
            fill="none"
          >
            <path
              d="M1 0.75H17C17.1381 0.75 17.25 0.861929 17.25 1V21.6797C17.25 21.8989 16.9876 22.0127 16.8281 21.8623L10.2012 15.6035C9.52676 14.9666 8.47324 14.9666 7.79883 15.6035L1.17188 21.8623C1.01243 22.0127 0.75 21.8989 0.75 21.6797V1C0.75 0.861929 0.861929 0.75 1 0.75Z"
              fill="none"
              stroke={`${theme === "light" ? "#374151" : "#e5e7eb"}`}
              stroke-width="1.5"
            />
          </svg>
          <p className="font-inter font-semibold text-gray-700 hidden md:inline-block dark:text-gray-200">
            Bookmark
          </p>
        </div>
      </Option>
      <Option path={"/home/notification"}>
        <div
          className={`flex flex-row gap-2 items-center justify-center p-4 hover:bg-blue-100 dark:hover:bg-blue-700 ${
            options === "/home/notification"
              ? "bg-blue-100 dark:bg-blue-700"
              : ""
          } relative md:justify-start`}
          onClick={(e) => {
            setOptions("/home/notification")
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 640 640"
            fill={`${theme === "light" ? "#374151" : "#e5e7eb"}`}
          >
            <path d="M320 64C306.7 64 296 74.7 296 88L296 97.7C214.6 109.3 152 179.4 152 264L152 278.5C152 316.2 142 353.2 123 385.8L101.1 423.2C97.8 429 96 435.5 96 442.2C96 463.1 112.9 480 133.8 480L506.2 480C527.1 480 544 463.1 544 442.2C544 435.5 542.2 428.9 538.9 423.2L517 385.7C498 353.1 488 316.1 488 278.4L488 263.9C488 179.3 425.4 109.2 344 97.6L344 87.9C344 74.6 333.3 63.9 320 63.9zM488.4 432L151.5 432L164.4 409.9C187.7 370 200 324.6 200 278.5L200 264C200 197.7 253.7 144 320 144C386.3 144 440 197.7 440 264L440 278.5C440 324.7 452.3 370 475.5 409.9L488.4 432zM252.1 528C262 556 288.7 576 320 576C351.3 576 378 556 387.9 528L252.1 528z" />
          </svg>
          <p className="font-inter font-semibold text-gray-700 hidden md:inline-block dark:text-gray-200">
            Notification
          </p>
          {notificationList.isPending && ""}
          {notificationList.isSuccess && (
            <>
              {notificationList.data.length > 0 && (
                <div className="w-2 h-2 bg-blue-800 rounded-full absolute right-2 top-3 dark:bg-blue-200"></div>
              )}
            </>
          )}
        </div>
      </Option>
      <Option path={"/home/search"}>
        <div
          className={`flex flex-row gap-2 items-center justify-center p-4 hover:bg-blue-100 dark:hover:bg-blue-700 ${
            options === "/home/search" ? "bg-blue-100 dark:bg-blue-700" : ""
          } relative md:justify-start`}
          onClick={(e) => {
            setOptions("/home/search")
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            width={`24px`}
            height={`24px`}
            fill={`${theme === "light" ? "#374151" : "#e5e7eb"}`}
          >
            <path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" />
          </svg>
          <p className="font-inter font-semibold text-gray-700 hidden md:inline-block dark:text-gray-200">
            Search
          </p>
        </div>
      </Option>
      <div
        className="flex flex-row gap-2 p-4 items-center justify-center cursor-pointer md:justify-start"
        onClick={() => {
          logoutHandler()
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          width={`24px`}
          height={`24px`}
          fill={`${theme === "light" ? "#374151" : "#e5e7eb"}`}
        >
          <path d="M224 160C241.7 160 256 145.7 256 128C256 110.3 241.7 96 224 96L160 96C107 96 64 139 64 192L64 448C64 501 107 544 160 544L224 544C241.7 544 256 529.7 256 512C256 494.3 241.7 480 224 480L160 480C142.3 480 128 465.7 128 448L128 192C128 174.3 142.3 160 160 160L224 160zM566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L438.6 169.3C426.1 156.8 405.8 156.8 393.3 169.3C380.8 181.8 380.8 202.1 393.3 214.6L466.7 288L256 288C238.3 288 224 302.3 224 320C224 337.7 238.3 352 256 352L466.7 352L393.3 425.4C380.8 437.9 380.8 458.2 393.3 470.7C405.8 483.2 426.1 483.2 438.6 470.7L566.6 342.7z" />
        </svg>
        <p className="font-inter font-semibold text-gray-700 hidden md:inline-block xl:inline-block dark:text-gray-200">
          Logout
        </p>
      </div>
      <div className="flex flex-row justify-center p-2">
        <p
          onClick={toggleTheme}
          className="px-2 bg-gray-50 text-gray-700 drop-shadow rounded-md dark:bg-gray-600 dark:text-gray-50 cursor-pointer"
        >
          {`${theme === "light" ? "Dark" : "Light"}`}
        </p>
      </div>
    </nav>
  )
}
