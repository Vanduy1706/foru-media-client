async function getAllForum({ createdAt }) {
  try {
    const forum = await fetch(
      `${process.env.SERVER_URL}/speech/forum${
        createdAt ? `?lastCreatedAt=${createdAt}` : ""
      }`,
      {
        method: "GET",
        credentials: "include",
      }
    )

    if (!forum.ok) {
      throw new Error("Something is wrong")
    }

    const data = await forum.json()
    return data
  } catch (error) {
    throw error
  }
}

export { getAllForum }
