async function searchSpeechOrUser({ searchInput }) {
  if (searchInput.length === 0) return []
  const result = await fetch(
    `${process.env.SERVER_URL}/search?input=${searchInput}`,
    {
      method: "GET",
      credentials: "include",
    }
  )

  if (!result.ok) {
    throw new Error("Something is wrong")
  }

  const data = await result.json()
  return data
}

export { searchSpeechOrUser }
