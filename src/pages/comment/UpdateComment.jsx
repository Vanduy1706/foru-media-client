import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProfileUser } from "../../apis/user/getProfile"
import { useState } from "react"
import { updateSpeechWithAuthor } from "../../apis/speech/updateSpeech"
import { useCommentId } from "../../hooks/CommentContext"
import { useSetOpenForm } from "../../hooks/OpenFormContext"
import { updateComment } from "../../apis/comment/updateComment"
import { useStatus } from "../../hooks/StatusContext"

export default function UpdateComment() {
  const queryClient = useQueryClient()
  const comment = useCommentId()
  const setOpenForm = useSetOpenForm()
  const { addStatus } = useStatus()
  const [content, setContent] = useState(comment.content)

  const profile = useQuery({
    queryKey: ["profileUser"],
    queryFn: getProfileUser,
    staleTime: 1000 * 60 * 5,
  })

  const updatedComment = useMutation({
    mutationFn: updateComment,
    onSuccess: (data) => {
      // queryClient.setQueryData(["comments", data.parentSpeech], (old) => {
      //   if (!old) return
      //   return old.map((comment) => {
      //     if (comment._id === data._id) {
      //       return data
      //     } else {
      //       return comment
      //     }
      //   })
      // })

      queryClient.setQueryData(["commentDetail", data._id], (old) => {
        if (!old) return
        return { ...data }
      })

      // queryClient.setQueryData(
      //   [
      //     "replies",
      //     {
      //       commentId: data.path[data.path.length - 1],
      //       speechId: data.parentSpeech,
      //     },
      //   ],
      //   (old) => {
      //     if (!old) return
      //     return old.map((reply) => {
      //       if (reply._id === data._id) {
      //         return data
      //       } else {
      //         return reply
      //       }
      //     })
      //   }
      // )

      // queryClient.invalidateQueries(["comments"])
      addStatus("success")
      setOpenForm(false)
    },
    onError: (error) => {
      addStatus("failed")
      setContent("")
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
        className="w-3/4 p-4 absolute bg-gray-50 flex flex-col gap-2 rounded z-50 sm:w-2/3 lg:w-1/2 xl:w-1/3 dark:bg-gray-800"
        onSubmit={(e) => {
          e.preventDefault()
          updatedComment.mutate({ content, commentId: comment.commentId })
        }}
      >
        <div className="flex flex-row justify-between items-center">
          <p className="font-inter font-semibold text-gray-800 text-lg dark:text-gray-200">
            Update Comment
          </p>
          <button
            className="py-2 px-4 bg-blue-700 text-gray-50 rounded disabled:bg-blue-200 disabled:cursor-not-allowed dark:bg-blue-200 dark:text-gray-800 dark:disabled:bg-blue-800"
            type="submit"
            disabled={
              updateComment.isPending || content.length === 0 ? true : false
            }
          >
            {updateComment.isPending ? (
              <div className="spinner dark:spinner-dark"></div>
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
          className="bg-gray-100 focus:outline-blue-500 p-4 dark:bg-gray-600 dark:text-gray-50"
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
