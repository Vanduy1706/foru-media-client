import Card from "../../components/Card"
import Comment from "../../components/Comment"
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { getAllForum } from "../../apis/speech/findAllForum"
import { Fragment, useEffect, useRef, useState } from "react"
import { useTheme } from "../../hooks/ThemeContext"
// import { io } from "socket.io-client"

export default function Speech() {
  // const [toggle, setToggle] = useState("")
  const scrollRef = useRef(null)
  const { theme, toggleTheme } = useTheme()
  // const socketRef = useRef(null)
  // const [newSpeech, setNewSpeech] = useState([])

  // const forums = useQuery({
  //   queryKey: ["forums", { createdAt: lastCreatedAt }],
  //   queryFn: () => getAllForum({ createdAt: lastCreatedAt }),
  // })

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["forums"],
    queryFn: ({ pageParam = null }) => getAllForum({ createdAt: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) return undefined
      return lastPage[lastPage.length - 1].createdAt
    },
  })

  // useEffect(() => {
  //   const div = scrollRef.current

  //   const handleScroll = () => {
  //     if (div.scrollTop + div.clientHeight >= div.scrollHeight - 10) {
  //       if (forums.isSuccess && forums.data.length > 0) {
  //         const lastSpeech = forums.data[forums.data.length - 1].createdAt
  //         setLastCreatedAt(lastSpeech)
  //       }
  //     }
  //   }

  //   if (div) {
  //     div.addEventListener("scroll", handleScroll)
  //   }

  //   return () => {
  //     if (div) {
  //       div.removeEventListener("scroll", handleScroll)
  //     }
  //   }
  // }, [forums.isSuccess])

  useEffect(() => {
    const div = scrollRef.current
    if (!div) return

    const handleScroll = () => {
      if (div.scrollTop + div.clientHeight >= div.scrollHeight - 10) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }
    }

    div.addEventListener("scroll", handleScroll)
    return () => div.removeEventListener("scroll", handleScroll)
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // useEffect(() => {
  //   socketRef.current = io(process.env.SERVER_URL)

  //   return () => {
  //     socketRef.current.disconnect()
  //   }
  // }, [])

  // useEffect(() => {
  //   if (!socketRef.current) return
  //   socketRef.current.on("refetchAllSpeeches", (data) => {
  //     setNewSpeech((prev) => [...prev, ...data])
  //   })

  //   return () => socketRef.current.off("refetchAllSpeeches")
  // }, [socketRef.current])

  // useEffect(() => {
  //   if (forums.isSuccess && forums.data) {
  //     setAllForums((prev) => [...prev, ...forums.data])
  //   }
  // }, [forums.data, forums.isSuccess])

  // function toggleHandler(speechId) {
  //   if (toggle) {
  //     setToggle("")
  //   } else {
  //     setToggle(speechId)
  //   }
  // }

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-50 flex justify-center m-4 dark:bg-gray-700">
        <div className="w-fit h-fit p-2 rounded-full bg-gray-50 drop-shadow-lg dark:bg-gray-600">
          <div className="spinner dark:spinner-dark"></div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full h-full bg-gray-50 flex justify-center m-4 dark:bg-gray-700">
        <div className="w-fit h-fit p-2 rounded-md text-center bg-gray-50 drop-shadow-lg dark:bg-gray-600">
          <p>500</p>
          <p>Something wrong happened with the server</p>
        </div>
      </div>
    )
  }

  // return (
  //   <div ref={scrollRef} className="w-full h-full bg-gray-50 overflow-y-scroll">
  //     {forums.isSuccess && (
  //       <div>
  //         {allForums.map((forum, index) => {
  //           if (!forum.targetType) {
  //             return (
  //               <Fragment key={index}>
  //                 <Card
  //                   speechId={forum._id}
  //                   toggleHandler={toggleHandler}
  //                   toggle={toggle}
  //                 />
  //               </Fragment>
  //             )
  //           }

  //           if (forum.targetType === "speech") {
  //             return (
  //               <Fragment key={index}>
  //                 <div className="flex flex-row gap-1 px-4 pt-2 items-center">
  //                   <svg
  //                     xmlns="http://www.w3.org/2000/svg"
  //                     width="20"
  //                     height="15"
  //                     viewBox="0 0 24 19"
  //                     fill="none"
  //                   >
  //                     <path
  //                       d="M21.5773 16.418C21.5773 17.4255 20.7606 18.2422 19.7531 18.2422H3.33512V16.418H19.7531V7.29688H21.5773V16.418ZM6.21305 11.4014C6.61502 11.4015 6.81993 11.8841 6.54117 12.1738L3.66324 15.1641C3.48383 15.3505 3.18543 15.3505 3.00602 15.1641L0.128087 12.1738C-0.150436 11.8841 0.0551938 11.4014 0.457189 11.4014H6.21305ZM20.6652 1.82422H4.24723V10.9453H2.42301V1.82422C2.42301 0.81673 3.23973 3.21982e-06 4.24723 0H20.6652V1.82422ZM20.3371 3.07812C20.5165 2.89174 20.8149 2.8917 20.9943 3.07812L23.8713 6.06836C24.15 6.35809 23.9452 6.84081 23.5431 6.84082H17.7873C17.3853 6.84068 17.1804 6.35805 17.4591 6.06836L20.3371 3.07812Z"
  //                       fill="#ff0032"
  //                     />
  //                   </svg>
  //                   <p className="font-inter font-semibold text-gray-500 italic">
  //                     {forum.author.username.length >= 20
  //                       ? `${forum.author.username.slice(0, 20)}...`
  //                       : `${forum.author.username}`}{" "}
  //                     republished
  //                   </p>
  //                 </div>
  //                 <Card
  //                   speechId={forum.targetId}
  //                   toggleHandler={toggleHandler}
  //                   toggle={toggle}
  //                 />
  //               </Fragment>
  //             )
  //           }

  //           if (forum.targetType === "comment") {
  //             return (
  //               <Fragment key={index}>
  //                 <div className="flex flex-row gap-2 px-4 pt-2 items-center">
  //                   <svg
  //                     xmlns="http://www.w3.org/2000/svg"
  //                     width="20"
  //                     height="15"
  //                     viewBox="0 0 24 19"
  //                     fill="none"
  //                   >
  //                     <path
  //                       d="M21.5773 16.418C21.5773 17.4255 20.7606 18.2422 19.7531 18.2422H3.33512V16.418H19.7531V7.29688H21.5773V16.418ZM6.21305 11.4014C6.61502 11.4015 6.81993 11.8841 6.54117 12.1738L3.66324 15.1641C3.48383 15.3505 3.18543 15.3505 3.00602 15.1641L0.128087 12.1738C-0.150436 11.8841 0.0551938 11.4014 0.457189 11.4014H6.21305ZM20.6652 1.82422H4.24723V10.9453H2.42301V1.82422C2.42301 0.81673 3.23973 3.21982e-06 4.24723 0H20.6652V1.82422ZM20.3371 3.07812C20.5165 2.89174 20.8149 2.8917 20.9943 3.07812L23.8713 6.06836C24.15 6.35809 23.9452 6.84081 23.5431 6.84082H17.7873C17.3853 6.84068 17.1804 6.35805 17.4591 6.06836L20.3371 3.07812Z"
  //                       fill="#ff0032"
  //                     />
  //                   </svg>
  //                   <p className="font-inter font-semibold text-gray-500 italic break-words">
  //                     {forum.author.username.length >= 20
  //                       ? `${forum.author.username.slice(0, 20)}...`
  //                       : `${forum.author.username}`}{" "}
  //                     republished
  //                   </p>
  //                 </div>
  //                 <Comment
  //                   commentId={forum.targetId}
  //                   toggleHandler={toggleHandler}
  //                   toggle={toggle}
  //                 />
  //               </Fragment>
  //             )
  //           }
  //         })}
  //       </div>
  //     )}
  //   </div>
  // )

  return (
    <div
      ref={scrollRef}
      className="w-full h-full bg-gray-50 overflow-y-scroll dark:bg-gray-700"
    >
      {data?.pages.map((page, pageIndex) => (
        <Fragment key={pageIndex}>
          {page.map((forum, index) => {
            if (!forum.targetType) {
              return (
                <Card
                  speechId={forum._id}
                  // toggleHandler={toggleHandler}
                  // toggle={toggle}
                  shareId={null}
                  key={index}
                />
              )
            }

            if (forum.targetType === "speech") {
              return (
                <Fragment key={forum._id}>
                  <div className="flex flex-row gap-1 px-4 pt-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="15"
                      viewBox="0 0 24 19"
                      fill="none"
                    >
                      <path
                        d="M21.5773 16.418C21.5773 17.4255 20.7606 18.2422 19.7531 18.2422H3.33512V16.418H19.7531V7.29688H21.5773V16.418ZM6.21305 11.4014C6.61502 11.4015 6.81993 11.8841 6.54117 12.1738L3.66324 15.1641C3.48383 15.3505 3.18543 15.3505 3.00602 15.1641L0.128087 12.1738C-0.150436 11.8841 0.0551938 11.4014 0.457189 11.4014H6.21305ZM20.6652 1.82422H4.24723V10.9453H2.42301V1.82422C2.42301 0.81673 3.23973 3.21982e-06 4.24723 0H20.6652V1.82422ZM20.3371 3.07812C20.5165 2.89174 20.8149 2.8917 20.9943 3.07812L23.8713 6.06836C24.15 6.35809 23.9452 6.84081 23.5431 6.84082H17.7873C17.3853 6.84068 17.1804 6.35805 17.4591 6.06836L20.3371 3.07812Z"
                        fill={`${theme === "light" ? "#ff0032" : "#ffc5dc"}`}
                      />
                    </svg>
                    <p className="font-inter font-semibold text-gray-500 italic dark:text-gray-300">
                      {forum.author.username.length >= 20
                        ? `${forum.author.username.slice(0, 20)}...`
                        : forum.author.username}{" "}
                      republished
                    </p>
                  </div>
                  <Card
                    speechId={forum.targetId}
                    // toggleHandler={toggleHandler}
                    // toggle={toggle}
                    shareId={forum._id}
                    key={index}
                  />
                </Fragment>
              )
            }

            if (forum.targetType === "comment") {
              return (
                <Fragment key={forum._id}>
                  <div className="flex flex-row gap-2 px-4 pt-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="15"
                      viewBox="0 0 24 19"
                      fill="none"
                    >
                      <path
                        d="M21.5773 16.418C21.5773 17.4255 20.7606 18.2422 19.7531 18.2422H3.33512V16.418H19.7531V7.29688H21.5773V16.418ZM6.21305 11.4014C6.61502 11.4015 6.81993 11.8841 6.54117 12.1738L3.66324 15.1641C3.48383 15.3505 3.18543 15.3505 3.00602 15.1641L0.128087 12.1738C-0.150436 11.8841 0.0551938 11.4014 0.457189 11.4014H6.21305ZM20.6652 1.82422H4.24723V10.9453H2.42301V1.82422C2.42301 0.81673 3.23973 3.21982e-06 4.24723 0H20.6652V1.82422ZM20.3371 3.07812C20.5165 2.89174 20.8149 2.8917 20.9943 3.07812L23.8713 6.06836C24.15 6.35809 23.9452 6.84081 23.5431 6.84082H17.7873C17.3853 6.84068 17.1804 6.35805 17.4591 6.06836L20.3371 3.07812Z"
                        fill={`${theme === "light" ? "#ff0032" : "#ffc5dc"}`}
                      />
                    </svg>
                    <p className="font-inter font-semibold text-gray-500 italic break-words dark:text-gray-300">
                      {forum.author.username.length >= 20
                        ? `${forum.author.username.slice(0, 20)}...`
                        : forum.author.username}{" "}
                      republished
                    </p>
                  </div>
                  <Comment
                    commentId={forum.targetId}
                    // toggleHandler={toggleHandler}
                    // toggle={toggle}
                    shareId={forum._id}
                    key={index}
                  />
                </Fragment>
              )
            }
          })}
        </Fragment>
      ))}

      {isFetchingNextPage && (
        <div className="w-full h-full bg-gray-50 flex justify-center m-4 dark:bg-gray-700">
          <div className="w-fit h-fit p-2 rounded-full bg-gray-50 drop-shadow-lg dark:bg-gray-600">
            <div className="spinner dark:spinner-dark"></div>
          </div>
        </div>
      )}
    </div>
  )
}
