async function updateComment({ content, commentId }) {
  const result = await fetch(`${process.env.SERVER_URL}/comment/${commentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      content: content,
    }),
  })

  if (!result.ok) {
    const error = await result.json()
    throw new Error(error.message)
  }

  const data = await result.json()
  return data
}

export { updateComment }
