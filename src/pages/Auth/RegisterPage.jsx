import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router"

export default function RegisterPage() {
  const navigation = useNavigate()
  const [username, setUsername] = useState("")
  const [nickname, setNickname] = useState("")
  const [error, setError] = useState("")

  async function handlerRegister({ username, nickname }) {
    const result = await fetch(`${process.env.SERVER_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: username,
        nickname: nickname,
      }),
    })

    const data = await result.json()

    if (!result.ok) {
      throw new Error(data.message)
    }

    return data
  }

  const register = useMutation({
    mutationFn: handlerRegister,
    onSuccess: (data) => {
      navigation(data.redirectTo)
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  return (
    <article className="w-full h-full flex justify-center items-center bg-gray-50">
      <form
        className="w-4/5 h-fit flex flex-col gap-2 items-center bg-gray-100 p-5 drop-shadow-md rounded-md"
        onSubmit={(e) => {
          e.preventDefault()
          register.mutate({
            username,
            nickname,
          })
        }}
      >
        <label className="font-inter font-semibold text-gray-500 text-2xl">
          Register Information
        </label>
        <p className="font-inter font-normal text-base text-gray-400 text-center">
          Before entering the forum, I need to know who you are.
        </p>
        <input
          className="w-full h-12 px-3 rounded focus:outline-blue-500 font-inter font-normal text-gray-800"
          type="text"
          placeholder="User name"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full h-12 px-3 rounded focus:outline-blue-500 font-inter font-normal text-gray-800"
          type="text"
          placeholder="Nick name"
          required
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        {register.isError && (
          <p className="w-full font-inter font-medium text-left text-red-500">
            {error}
          </p>
        )}
        <p className="w-full font-inter font-bold text-base text-gray-700">
          Rules:
        </p>
        <p className="w-full font-inter font-medium text-base text-gray-500 text-justify">
          - You can name any username you want. But as long as it's not longer
          than <span className="font-bold text-blue-700">60 characters</span>.
        </p>
        <p className="w-full font-inter font-medium text-base text-gray-500 text-justify">
          - Similar to username. But nickname can only be named with{" "}
          <span className="font-bold text-blue-700">letters</span> and{" "}
          <span className="font-bold text-blue-700">numbers</span> (not
          including spaces or special characters)
        </p>
        <button
          className="w-full py-2 bg-blue-500 text-gray-100 rounded hover:bg-blue-400 active:bg-blue-600 disabled:bg-blue-200 disabled:cursor-not-allowed"
          type="submit"
          disabled={
            register.isPending || username.length === 0 || nickname.length === 0
              ? true
              : false
          }
        >
          {register.isPending ? <div className="spinner"></div> : "Register"}
        </button>
      </form>
    </article>
  )
}
