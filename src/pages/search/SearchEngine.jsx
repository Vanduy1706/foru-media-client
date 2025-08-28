import { useMutation, useQuery } from "@tanstack/react-query"
import { searchSpeechOrUser } from "../../apis/search/searchSpeechOrUser"
import { Fragment, useState } from "react"
import Card from "../../components/Card"

export default function SearchEngine() {
  const [searchInput, setSearchInput] = useState("")

  const searchResult = useMutation({
    mutationFn: searchSpeechOrUser,
    // queryKey: ["searchResult", { searchInput }],
    // queryFn: () => searchSpeechOrUser({ searchInput }),
  })

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-start space-x-2 p-4 border border-gray-200 drop-shadow-sm dark:border-gray-700">
        <input
          type="text"
          placeholder="Search..."
          className="w-full border text-gray-700 bg-gray-50 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-200"
          value={searchInput}
          onChange={(e) => {
            e.preventDefault()
            setSearchInput(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              searchResult.mutate({ searchInput: searchInput })
            }
          }}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={(e) => {
            e.preventDefault()
            searchResult.mutate({ searchInput: searchInput })
          }}
        >
          Search
        </button>
      </div>
      <div className="h-full overflow-y-auto">
        {searchResult.isPending && (
          <div className="w-full h-full bg-gray-50 flex justify-center m-4 dark:bg-gray-700">
            <div className="w-fit h-fit p-2 rounded-full bg-gray-50 drop-shadow-lg dark:bg-gray-600">
              <div className="spinner dark:spinner-dark"></div>
            </div>
          </div>
        )}
        {searchResult.isSuccess && (
          <>
            {searchResult.data.map((data, index) => {
              return (
                <Fragment key={index}>
                  <Card speechId={data._id} />
                </Fragment>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}
