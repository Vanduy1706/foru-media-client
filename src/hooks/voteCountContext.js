import { createContext, useContext } from "react"
import { voteSpeechOrComment } from "../apis/vote/voteSpeechOrComment"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const VoteCountContext = createContext(null)

export function VoteCountProvider({ children }) {
  const queryClient = useQueryClient()

  const vote = useMutation({
    mutationFn: voteSpeechOrComment,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["voteDetail", data.vote._id], (old) => {
        return data.isVoted
      })

      if (variables.targetType === "speech") {
        // queryClient.setQueryData(["speeches"], (old) => {
        //   if (!old) return
        //   return old.map((speech) => {
        //     if (speech._id === data._id) {
        //       return { ...speech, voteCount: data.voteCount }
        //     } else {
        //       return speech
        //     }
        //   })
        // })

        queryClient.setQueryData(["speechDetail", data.vote._id], (old) => {
          if (!old) return
          return { ...data.vote }
        })
      }

      if (variables.targetType === "comment") {
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

        queryClient.setQueryData(["commentDetail", data.vote._id], (old) => {
          if (!old) return
          return { ...data.vote }
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
      }

      // queryClient.invalidateQueries(["speechDetail"])
      // queryClient.invalidateQueries(["nestedReply"])
    },
    onError: (error) => {},
  })

  return <VoteCountContext value={vote}>{children}</VoteCountContext>
}

export function useVote() {
  return useContext(VoteCountContext)
}
