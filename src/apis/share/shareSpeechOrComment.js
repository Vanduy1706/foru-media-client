async function shareSpeechOrComment({ targetType, targetId }) {
  try {
    const result = await fetch(`${process.env.SERVER_URL}/share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        targetType: targetType,
        targetId: targetId,
      }),
    })

    if (!result.ok) {
      const error = await result.json()
      throw new Error(error.message)
    }

    const data = await result.json()
    return data
  } catch (error) {
    throw error
  }
}

export { shareSpeechOrComment }
