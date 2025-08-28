async function getProfileUser() {
  const result = await fetch(`${process.env.SERVER_URL}/user/profile`, {
    method: "GET",
    credentials: "include",
  })

  const data = await result.json()

  if (!result.ok) {
    throw new Error(data.message ?? "Something is wrong")
  }

  return data
}

export { getProfileUser }
