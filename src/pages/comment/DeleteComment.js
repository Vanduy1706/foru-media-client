import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSetOpenDialog } from "../../hooks/OpenDialogContext"
import { deleteOneComment } from "../../apis/comment/deleteComment"
import { useCommentId } from "../../hooks/CommentContext"
import { useStatus } from "../../hooks/StatusContext"

export default function DeleteCommentDialog() {
  const setOpenDialog = useSetOpenDialog()
  const queryClient = useQueryClient()
  const comment = useCommentId()
  const { addStatus } = useStatus()

  const deleteComment = useMutation({
    mutationFn: deleteOneComment,
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
      setOpenDialog(false)
      addStatus("success")
    },
    onError: (error) => {
      setOpenDialog(false)
      addStatus("failed")
    },
  })

  return (
    <>
      <div
        className="w-full h-full absolute bg-gray-800 opacity-75 z-40 dark:bg-gray-200"
        onClick={() => {
          setOpenDialog(false)
        }}
      ></div>
      <div className="w-2/3 h-fit flex flex-col gap-2 absolute z-50 p-4 bg-gray-50 rounded dark:bg-gray-700 sm:w-2/3 lg:w-1/2 xl:w-1/3">
        <p className="text-center font-inter font-normal text-base text-gray-700 dark:text-gray-200">
          Are you sure you want delete this comment?
        </p>
        {deleteComment.isPending ? (
          <div className="spinner dark:spinner-dark"></div>
        ) : (
          <div className="flex flex-row justify-evenly">
            <p
              className="px-4 py-2 bg-red-200 text-gray-800 rounded cursor-pointer hover:bg-red-100 dark:bg-red-700 dark:text-gray-200 dark:hover:bg-red-600"
              onClick={() => {
                deleteComment.mutate(comment.commentId)
                setOpenDialog(false)
              }}
            >
              Yes
            </p>
            <p
              onClick={() => {
                setOpenDialog(false)
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded cursor-pointer hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </p>
          </div>
        )}
      </div>
    </>
  )
}
