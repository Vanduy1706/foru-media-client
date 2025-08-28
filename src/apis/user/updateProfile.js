async function updateProfileUser({ userId, username, nickname }) {
  const result = await fetch(
    `${process.env.SERVER_URL}/user/profile/${userId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: username,
        nickname: nickname,
      }),
    }
  )

  if (!result.ok) {
    const error = await result.json()
    throw new Error(error.message)
  }

  const data = await result.json()
  return data
}

export { updateProfileUser }
