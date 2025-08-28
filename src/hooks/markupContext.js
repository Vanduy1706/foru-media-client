import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createContext, useContext } from "react"
import { createMarkUp } from "../apis/markup/createMarkUp"
import { useStatus } from "./StatusContext"

const MarkupContext = createContext(null)

export function MarkupProvider({ children }) {
  const queryClient = useQueryClient()
  const { addStatus } = useStatus()

  const markup = useMutation({
    mutationFn: createMarkUp,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["markupDetail", data?.targetId], (old) => {
        return data
      })

      queryClient.invalidateQueries(["speechDetail"])
      queryClient.invalidateQueries(["nestedReply"])
      if (data) {
        addStatus("markup")
      } else {
        addStatus("unMarkup")
      }
    },
    onError: (error) => {
      addStatus("markup failed")
    },
  })

  return <MarkupContext value={markup}>{children}</MarkupContext>
}

export function useMarkup() {
  return useContext(MarkupContext)
}
