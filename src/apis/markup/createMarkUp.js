async function createMarkUp({ targetType, targetId }) {
  try {
    const result = await fetch(`${process.env.SERVER_URL}/markup`, {
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
      throw new Error("Something is wrong")
    }

    const data = await result.json()
    return data
  } catch (error) {
    throw error
  }
}

export { createMarkUp }
