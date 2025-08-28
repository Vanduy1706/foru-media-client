async function getAllSpeech() {
  const result = await fetch(`${process.env.SERVER_URL}/speech`, {
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

async function getAllSpeechIds() {
  const result = await fetch(`${process.env.SERVER_URL}/speech/all/id`, {
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
export { getAllSpeech, getAllSpeechIds }
