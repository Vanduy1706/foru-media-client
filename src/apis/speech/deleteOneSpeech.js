async function deleteOneSpeech(speechId) {
  const result = await fetch(
    `${process.env.SERVER_URL}/speech/delete/${speechId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
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

export { deleteOneSpeech }
