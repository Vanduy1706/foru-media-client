async function getCommentOnSpeech({ id, sortType }) {
  const result = await fetch(
    `${process.env.SERVER_URL}/comment/speech/${id}?sortType=${sortType}`,
    {
      method: "GET",
      credentials: "include",
    }
  )

  if (!result.ok) {
    const error = await result.json()
    throw new Error(error.message)
  }

  const data = await result.json()
  if (data.length === 0) {
    throw new Error("No comment")
  }

  return data
}

export { getCommentOnSpeech }
