import { useState } from "react"
import { getDetailSpeech } from "../../apis/speech/getDetailSpeech"
import { getProfileUser } from "../../apis/user/getProfile"
import { useSpeechId } from "../../hooks/SpeechContext"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createComment } from "../../apis/comment/createComment"
import { useSetOpenForm } from "../../hooks/OpenFormContext"
import { useStatus } from "../../hooks/StatusContext"

export default function CreateComment() {
  const speech = useSpeechId()
  const setOpenForm = useSetOpenForm()
  const queryClient = useQueryClient()
  const { addStatus } = useStatus()
  const [content, setContent] = useState("")

  const speechDetail = useQuery({
    queryKey: ["speechDetail", speech.speechId],
    queryFn: () => getDetailSpeech(speech.speechId),
    staleTime: 1000 * 60 * 5,
  })

  const profile = useQuery({
    queryKey: ["profileUser"],
    queryFn: getProfileUser,
    staleTime: 1000 * 60 * 5,
  })

  const comment = useMutation({
    mutationFn: createComment,
    onSuccess: (data, variables) => {
      // queryClient.setQueryData(["speeches"], (old) => {
      //   if (!old) return
      //   return old.map((speech) => {
      //     if (speech._id === data.comment.parentSpeech) {
      //       return { ...speech, commentCount: speech.commentCount + 1 }
      //     } else {
      //       return speech
      //     }
      //   })
      // })

      queryClient.setQueryData(
        ["speechDetail", data.comment.parentSpeech],
        (old) => {
          if (!old) return
          return { ...old, commentCount: old.commentCount + 1 }
        }
      )

      // queryClient.setQueryData(
      //   ["comments", data.comment.parentSpeech],
      //   (old) => {
      //     if (!old) return
      //     return [...old, data.comment]
      //   }
      // )

      queryClient.invalidateQueries(["nestedReply"])

      setContent("")
      setOpenForm(false)
      addStatus("success")
    },
    onError: (error) => {
      setContent("")
      addStatus("failed")
    },
  })

  if (speechDetail.isPending) {
    return <div className="spinner"></div>
  }

  return (
    <>
      <div
        className="w-full h-full p-4 absolute bg-gray-800 opacity-75 z-40 dark:bg-gray-200"
        onClick={() => {
          setOpenForm(false)
        }}
      ></div>
      <form
        className="w-3/4 p-4 absolute bg-gray-50 flex flex-col gap-2 rounded z-50 sm:w-2/3 lg:w-1/2 xl:w-1/3 dark:bg-gray-800"
        onSubmit={(e) => {
          e.preventDefault()
          comment.mutate({ content, speechId: speech.speechId })
        }}
      >
        <div className="flex flex-row flex-wrap gap-2 justify-between items-center">
          <p className="font-inter font-semibold text-blue-600 text-lg dark:text-blue-200">
            Comment @{speechDetail.data.author.nickname}
          </p>
          <button
            className="py-2 px-4 bg-blue-700 text-gray-50 rounded disabled:bg-blue-200 disabled:cursor-not-allowed dark:bg-blue-200 dark:text-gray-800 dark:disabled:bg-blue-800"
            type="submit"
            disabled={comment.isPending || content.length === 0 ? true : false}
          >
            {comment.isPending ? <div className="spinner"></div> : "Publish"}
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
          className="bg-gray-100 text-gray-700 focus:outline-blue-500 p-4 dark:bg-gray-600 dark:text-gray-50"
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
