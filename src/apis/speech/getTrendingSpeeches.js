async function getTrendingSpeeches() {
  const result = await fetch(`${process.env.SERVER_URL}/speech/trending`, {
    method: "GET",
    credentials: "include",
  })

  if (!result.ok) {
    const error = new Error("Something is wrong")
    throw error
  }

  const data = await result.json()
  return data
}

export { getTrendingSpeeches }
