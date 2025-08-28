async function getReplyOnComment({ commentId, speechId, sortType }) {
  const result = await fetch(
    `${process.env.SERVER_URL}/comment/${commentId}/speech/${speechId}?sortType=${sortType}`,
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
  return data
}

export { getReplyOnComment }
