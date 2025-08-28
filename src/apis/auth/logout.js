async function logout(params) {
  const result = await fetch(`${process.env.SERVER_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({}),
  })

  const data = await result.json()
  return data
}

export { logout }
