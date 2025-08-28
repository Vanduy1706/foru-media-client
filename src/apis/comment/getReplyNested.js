async function getReplyNested(commentId) {
  const result = await fetch(`${process.env.SERVER_URL}/reply/${commentId}`, {
    method: "GET",
    credentials: "include",
  })

  if (!result.ok) {
    const error = await result.json()
    throw new Error(error.message)
  }

  const data = await result.json()
  return data
}

export { getReplyNested }
