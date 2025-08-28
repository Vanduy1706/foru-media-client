import { createContext, useContext, useState } from "react"

const CommentIdContext = createContext(null)

const SetCommentIdContext = createContext(null)

export function CommentProvider({ children }) {
  const [commentId, setCommentId] = useState(null)

  return (
    <CommentIdContext value={commentId}>
      <SetCommentIdContext value={setCommentId}>{children}</SetCommentIdContext>
    </CommentIdContext>
  )
}

export function useComment() {
  return useContext(SetCommentIdContext)
}

export function useCommentId() {
  return useContext(CommentIdContext)
}
