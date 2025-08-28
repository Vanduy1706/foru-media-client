async function deleteOneComment(commentId) {
  const result = await fetch(
    `${process.env.SERVER_URL}/comment/delete/${commentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    }
  )

  if (!result.ok) {
    const error = await result.json()
    throw new Error(error.message)
  }

  const data = await result.json()
  return data
}

export { deleteOneComment }
