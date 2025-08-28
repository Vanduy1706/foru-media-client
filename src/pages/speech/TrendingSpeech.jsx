import { useQuery } from "@tanstack/react-query"
import { getTrendingSpeeches } from "../../apis/speech/getTrendingSpeeches"
import Card from "../../components/Card"
import { Fragment } from "react/jsx-runtime"
import { NavLink } from "react-router"
import { useFormatter } from "../../hooks/DatetimeContext"

export default function Trending() {
  const formatter = useFormatter()
  const trending = useQuery({
    queryKey: ["trending"],
    queryFn: getTrendingSpeeches,
  })

  if (trending.isPending) {
    return (
      <div className="w-fit h-fit p-2 rounded-full bg-gray-50 drop-shadow-lg">
        <div className="spinner"></div>
      </div>
    )
  }

  if (trending.isError) {
    return (
      <div className="w-fit h-fit p-2 rounded-md text-center bg-gray-50 drop-shadow-lg">
        <p>500</p>
        <p>Something wrong happened with the server</p>
      </div>
    )
  }

  return (
    <div className="w-fit h-full gap-2 border-red-400 border-4 rounded-md overflow-y-auto hidden md:flex md:flex-col md:gap-2">
      <p className="w-full p-2 font-inter font-semibold text-gray-50 bg-gradient-to-r rounded-sm from-red-400 to-purple-400">
        Top Trending (this week)
      </p>
      <div className="flex flex-col gap-2 px-4 pb-4">
        {trending.data.map((speech, index) =>
          speech.isSoftDeleted ? null : (
            <Fragment key={index}>
              <div className="flex justify-between">
                <p className="font-inter font-medium text-gray-700 dark:text-gray-200">
                  Rank {index + 1}
                </p>
                <p className="font-inter font-medium text-gray-700 dark:text-gray-200">
                  {speech.trendingScore}
                </p>
              </div>
              <div className="w-full flex flex-col gap-2 pb-4 border-b-2 border-gray-300 dark:border-gray-600">
                <NavLink to={`/home/speech/${speech._id}`}>
                  <div className="flex flex-col gap-2 pt-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                    <div className="px-4 flex flex-row justify-between items-center">
                      <div className="flex flex-col">
                        <p className="w-52 font-inter font-semibold text-gray-700 break-words dark:text-gray-200">
                          {speech.author.username.length >= 30
                            ? `${speech.author.username.slice(0, 30)}...`
                            : `${speech.author.username}`}
                        </p>
                        <p className="w-52 font-inter font-medium text-gray-500 break-words dark:text-gray-400">
                          @
                          {speech.author.nickname.length >= 30
                            ? `${speech.author.nickname.slice(0, 30)}...`
                            : `${speech.author.nickname}`}
                        </p>
                      </div>
                    </div>
                    <div className="px-4">
                      <p className="w-56 font-inter font-normal text-gray-700 text-justify break-words dark:text-gray-200">
                        {speech.content}
                      </p>
                    </div>
                  </div>
                </NavLink>
                <div className="flex flex-wrap gap-2 px-4">
                  <p className="font-inter font-normal text-gray-600 text-justify dark:text-gray-400">
                    <strong className="text-gray-700 dark:text-gray-200">
                      {speech.voteCount}
                    </strong>{" "}
                    votes
                  </p>
                  <p className="font-inter font-normal text-gray-600 text-justify dark:text-gray-400">
                    <strong className="text-gray-700 dark:text-gray-200">
                      {speech.commentCount}
                    </strong>{" "}
                    comments
                  </p>
                  <p className="font-inter font-normal text-gray-600 text-justify dark:text-gray-400">
                    <strong className="text-gray-700 dark:text-gray-200">
                      {speech.shareCount}
                    </strong>{" "}
                    shares
                  </p>
                </div>
                <div className="px-4">
                  <p className="font-inter font-medium text-gray-600 dark:text-gray-300">
                    &bull; {formatter(speech.createdAt).slice(8)}
                  </p>
                </div>
              </div>
            </Fragment>
          )
        )}
      </div>
    </div>
  )
}
