async function findAllShare() {
  try {
    const result = await fetch(`${process.env.SERVER_URL}/share`, {
      method: "GET",
      credentials: "include",
    })

    return await result.json()
  } catch (error) {
    throw error
  }
}

export { findAllShare }
