async function createReply({ content, commentId, speechId, path }) {
  const result = await fetch(`${process.env.SERVER_URL}/reply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      content: content,
      commentId: commentId,
      speechId: speechId,
      path: path,
    }),
  })

  if (result.status !== 201) {
    const error = await result.json()
    throw new Error(error.message)
  }

  const data = await result.json()
  return data
}

export { createReply }
