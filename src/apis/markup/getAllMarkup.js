async function getAllMarkUp() {
  const result = await fetch(`${process.env.SERVER_URL}/markup`, {
    method: "GET",
    credentials: "include",
  })

  if (!result.ok) {
    const error = await result.json()
    throw error.message
  }

  const data = await result.json()
  return data
}

export { getAllMarkUp }
