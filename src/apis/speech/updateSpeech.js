async function updateSpeechWithAuthor({ content, speechId }) {
  const result = await fetch(`${process.env.SERVER_URL}/speech/${speechId}`, {
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
    throw new Error(result.message)
  }

  const data = await result.json()
  return data
}

export { updateSpeechWithAuthor }
