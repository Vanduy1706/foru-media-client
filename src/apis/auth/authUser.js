async function authUser() {
  const result = await fetch(`${process.env.SERVER_URL}/auth/login`, {
    method: "GET",
    credentials: "include",
  })

  const data = await result.json()

  if (result.status === 403) {
    throw new Error(data.redirectTo)
  }

  if (result.status === 401) {
    const callRefresh = await fetch(
      `${process.env.SERVER_URL}/auth/refresh-token`,
      {
        method: "POST",
        credentials: "include",
      }
    )

    const resData = await callRefresh.json()

    if (callRefresh.status === 403) {
      throw new Error(resData.redirectTo)
    }

    return resData
  }

  return data
}

export { authUser }
