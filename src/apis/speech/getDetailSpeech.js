async function getDetailSpeech(speechId) {
  const result = await fetch(`${process.env.SERVER_URL}/speech/${speechId}`, {
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

export { getDetailSpeech }
