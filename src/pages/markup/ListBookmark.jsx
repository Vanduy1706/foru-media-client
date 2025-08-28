import { useQuery } from "@tanstack/react-query"
import { getAllMarkUp } from "../../apis/markup/getAllMarkup"
import Card from "../../components/Card"
import { Fragment, useState } from "react"
import Comment from "../../components/Comment"

export default function ListBookmark() {
  const [toggle, setToggle] = useState("")

  function toggleHandler(targetId) {
    if (toggle) {
      setToggle("")
    } else {
      setToggle(targetId)
    }
  }
  const allMarkupIds = useQuery({
    queryKey: ["allMarkup"],
    queryFn: getAllMarkUp,
    retry: false,
  })

  if (allMarkupIds.isPending) {
    return (
      <div className="w-full h-full bg-gray-50 flex justify-center m-4 dark:bg-gray-700">
        <div className="w-fit h-fit p-2 rounded-full bg-gray-50 drop-shadow-lg dark:bg-gray-600">
          <div className="spinner dark:spinner-dark"></div>
        </div>
      </div>
    )
  }

  if (allMarkupIds.isError) {
    return (
      <div className="w-full h-full bg-gray-50 dark:bg-gray-700">
        <p className="p-4 font-inter font-semibold text-xl text-gray-700 dark:text-gray-200">
          Bookmark
        </p>
      </div>
    )
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-700 overflow-y-scroll">
      <p className="p-4 font-inter font-semibold text-xl text-gray-700 dark:text-gray-200">
        Bookmark
      </p>
      {allMarkupIds.data.map((markup) => (
        <Fragment key={markup._id}>
          {markup.targetType === "speech" ? (
            <Card
              speechId={markup.targetId}
              toggle={toggle}
              toggleHandler={toggleHandler}
              key={markup.targetId}
            />
          ) : (
            <Comment
              commentId={markup.targetId}
              toggle={toggle}
              toggleHandler={toggleHandler}
              key={markup.targetId}
            />
          )}
        </Fragment>
      ))}
    </div>
  )
}
