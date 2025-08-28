async function getShare(targetId) {
  try {
    const result = await fetch(`${process.env.SERVER_URL}/share/${targetId}`, {
      method: "GET",
      credentials: "include",
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

export { getShare }
