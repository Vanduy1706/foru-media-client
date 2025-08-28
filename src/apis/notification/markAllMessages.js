async function markAllMessages() {
  try {
    const allMessage = await fetch(
      `${process.env.SERVER_URL}/notification/mark`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({}),
      }
    )

    if (!allMessage.ok) {
      throw new Error("Something is wrong")
    }

    const data = await allMessage.json()
    return data
  } catch (error) {
    throw error
  }
}

export { markAllMessages }
