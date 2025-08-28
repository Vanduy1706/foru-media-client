import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProfileUser } from "../../apis/user/getProfile"
import { useEffect, useState } from "react"
import { updateSpeechWithAuthor } from "../../apis/speech/updateSpeech"
import { useSpeechId } from "../../hooks/SpeechContext"
import { useSetOpenForm } from "../../hooks/OpenFormContext"
import { useStatus } from "../../hooks/StatusContext"

export default function UpdateSpeech() {
  const queryClient = useQueryClient()
  const speech = useSpeechId()
  const setOpenForm = useSetOpenForm()
  const { addStatus } = useStatus()
  const [content, setContent] = useState(speech.content)

  const profile = useQuery({
    queryKey: ["profileUser"],
    queryFn: getProfileUser,
    staleTime: 1000 * 60 * 5,
  })

  const updatedSpeech = useMutation({
    mutationFn: updateSpeechWithAuthor,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["speechDetail", speech.speechId], (old) => {
        if (!old) return
        return { ...data }
      })
      setContent("")
      setOpenForm(false)
      addStatus("success")
    },
    onError: (error) => {
      setContent("")
      addStatus("failed")
    },
  })

  return (
    <>
      <div
        className="w-full h-full p-4 absolute bg-gray-800 opacity-75 z-40 dark:bg-gray-200"
        onClick={() => {
          setOpenForm(false)
        }}
      ></div>
      <form
        className="w-3/4 p-4 absolute bg-gray-50 flex flex-col gap-2 rounded z-50 dark:bg-gray-800 sm:w-2/3 lg:w-1/2 xl:w-1/3"
        onSubmit={(e) => {
          e.preventDefault()
          updatedSpeech.mutate({ content, speechId: speech.speechId })
        }}
      >
        <div className="flex flex-row justify-between items-center">
          <p className="font-inter font-semibold text-gray-800 text-lg dark:text-gray-200">
            Update speech
          </p>
          <button
            className="py-2 px-4 bg-blue-700 text-gray-50 rounded disabled:bg-blue-200 disabled:cursor-not-allowed dark:bg-blue-200 dark:text-gray-800 dark:disabled:bg-blue-800"
            type="submit"
          >
            {updatedSpeech.isPending ? (
              <div className="spinner"></div>
            ) : (
              "Update"
            )}
          </button>
        </div>
        <div>
          {profile.isSuccess && (
            <>
              <p className="font-inter font-normal text-base text-gray-800 dark:text-gray-200">
                {profile.data.username}
              </p>
              <p className="font-inter font-normal text-base text-gray-800 dark:text-gray-200">
                @{profile.data.nickname}
              </p>
            </>
          )}
        </div>
        <textarea
          className="bg-gray-100 text-gray-800 focus:outline-blue-500 p-4 dark:bg-gray-600 dark:text-gray-50"
          rows={5}
          cols={40}
          maxLength={200}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </form>
    </>
  )
}
