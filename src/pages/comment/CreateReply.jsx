import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCommentId } from "../../hooks/CommentContext"
import { getDetailComment } from "../../apis/comment/getDetailComment"
import { getProfileUser } from "../../apis/user/getProfile"
import { createReply } from "../../apis/comment/createReply"
import { useState } from "react"
import { useSetOpenForm } from "../../hooks/OpenFormContext"
import { useStatus } from "../../hooks/StatusContext"

export default function CreateReply() {
  const comment = useCommentId()
  const setOpenForm = useSetOpenForm()
  const queryClient = useQueryClient()
  const { addStatus } = useStatus()
  const [content, setContent] = useState("")

  const commentDetail = useQuery({
    queryKey: ["commentDetail", comment.commentId],
    queryFn: () => getDetailComment(comment.commentId),
    retry: false,
  })

  const profile = useQuery({
    queryKey: ["profileUser"],
    queryFn: getProfileUser,
    staleTime: 1000 * 60 * 5,
  })

  const reply = useMutation({
    mutationFn: createReply,
    onSuccess: (data) => {
      queryClient.setQueryData(["comments", data.reply.parentSpeech], (old) => {
        if (!old) return
        return old.map((comment) => {
          if (comment._id === data.reply.path[data.reply.path.length - 1]) {
            return { ...comment, commentCount: comment.commentCount + 1 }
          } else {
            return comment
          }
        })
      })

      console.log(data.reply.path[data.reply.path.length - 2])
      // queryClient.setQueryData(
      //   [
      //     "replies",
      //     {
      //       commentId: data.reply.path[data.reply.path.length - 2],
      //       speechId: data.reply.parentSpeech,
      //     },
      //   ],
      //   (old) => {
      //     if (!old) return
      //     return old.map((reply) => {
      //       if (reply._id === data.reply.path[data.reply.path.length - 1]) {
      //         return { ...reply, commentCount: reply.commentCount + 1 }
      //       } else {
      //         return reply
      //       }
      //     })
      //   }
      // )

      // queryClient.setQueryData(
      //   [
      //     "replies",
      //     { commentId: comment.commentId, speechId: data.reply.parentSpeech },
      //   ],
      //   (old) => {
      //     if (!old) return
      //     return [...old, data.reply]
      //   }
      // )

      queryClient.setQueryData(["commentDetail", comment.commentId], (old) => {
        if (!old) return
        return { ...old, commentCount: old.commentCount + 1 }
      })

      queryClient.setQueryData(
        ["speechDetail", data.reply.parentSpeech],
        (old) => {
          if (!old) return
          return { ...old, commentCount: old.commentCount + 1 }
        }
      )

      // queryClient.setQueryData(["speeches"], (old) => {
      //   if (!old) return
      //   return old.map((speech) => {
      //     if (speech._id === id) {
      //       return { ...speech, commentCount: speech.commentCount + 1 }
      //     } else {
      //       return speech
      //     }
      //   })
      // })

      queryClient.invalidateQueries(["nestedReply"])
      setContent("")
      setOpenForm(false)
      addStatus("success")
    },
    onError: () => {
      setContent("")
      addStatus("failed")
    },
  })

  if (commentDetail.isPending) {
    return <div className="spinner"></div>
  }

  if (commentDetail.isError) {
    return (
      <p className="w-full h-full p-4 absolute bg-gray-800 opacity-75 z-40">
        {commentDetail.error.message}
      </p>
    )
  }

  return (
    <>
      <div
        className="w-full h-full p-4 absolute bg-gray-700 opacity-75 z-40 dark:bg-gray-200"
        onClick={() => {
          setOpenForm(false)
        }}
      ></div>
      <form
        className="w-3/4 p-4 absolute bg-gray-50 flex flex-col gap-2 rounded z-50 sm:w-2/3 lg:w-1/2 xl:w-1/3 dark:bg-gray-700"
        onSubmit={(e) => {
          e.preventDefault()
          reply.mutate({
            content,
            commentId: comment.commentId,
            speechId: commentDetail.data.parentSpeech,
            path: commentDetail.data.path,
          })
        }}
      >
        <div className="flex flex-row flex-wrap justify-between items-center">
          <p className="font-inter font-semibold text-blue-600 text-lg dark:text-blue-200">
            Reply @{commentDetail.data.author.nickname}
          </p>
          <button
            className="py-2 px-4 bg-blue-700 text-gray-50 rounded disabled:bg-blue-200 disabled:cursor-not-allowed dark:bg-blue-200 dark:text-gray-800 dark:disabled:bg-blue-800"
            type="submit"
            disabled={reply.isPending || content.length === 0 ? true : false}
          >
            {reply.isPending ? <div className="spinner"></div> : "Publish"}
          </button>
        </div>
        <div>
          {profile.isSuccess && (
            <>
              <p className="font-inter font-normal text-base text-gray-700 dark:text-gray-200">
                {profile.data.username}
              </p>
              <p className="font-inter font-normal text-base text-gray-700 dark:text-gray-200">
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
