async function createComment({ content, speechId }) {
  const result = await fetch(`${process.env.SERVER_URL}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      content: content,
      speechId: speechId,
    }),
  })

  if (!result.status === 201) {
    const error = await result.json()
    throw new Error(error.message)
  }

  const data = await result.json()
  return data
}

export { createComment }
