import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createContext, useContext } from "react"
import { shareSpeechOrComment } from "../apis/share/shareSpeechOrComment"

const ShareContext = createContext(null)

export function ShareProvider({ children }) {
  const queryClient = useQueryClient()

  const share = useMutation({
    mutationFn: shareSpeechOrComment,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["shareDetail", data.share._id], (old) => {
        return data.isShared
      })
      if (variables.targetType === "speech") {
        queryClient.setQueryData(["speechDetail", data.share._id], (old) => {
          if (!old) return
          return { ...data.share }
        })
      }

      if (variables.targetType === "comment") {
        queryClient.setQueryData(["commentDetail", data.share._id], (old) => {
          if (!old) return
          return { ...data.share }
        })
      }
      // queryClient.invalidateQueries(["forums"])
    },
    onError: (error) => {},
  })

  return <ShareContext value={share}>{children}</ShareContext>
}

export function useShare() {
  return useContext(ShareContext)
}
