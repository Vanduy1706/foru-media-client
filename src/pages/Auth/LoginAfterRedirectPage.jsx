import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router"

export default function LoginAfterRedirectPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  async function handlerLogin(email) {
    const result = await fetch(`${process.env.SERVER_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: email,
      }),
    })

    const data = await result.json()
    if (!result.ok) {
      throw new Error(data.message || "Unknown error")
    }

    return data
  }

  const login = useMutation({
    mutationFn: handlerLogin,
    onSuccess: (data) => {
      if (data.redirectTo) {
        navigate(data.redirectTo)
      }
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  return (
    <article className="w-full h-full flex justify-center items-center bg-gray-800">
      <form
        className="w-4/5 h-fit flex flex-col gap-2 items-center bg-gray-100 p-5 drop-shadow-md rounded-md"
        onSubmit={(e) => {
          e.preventDefault()
          login.mutate(email)
        }}
      >
        <label className="font-inter font-semibold text-gray-500 text-2xl">
          FO-RU
        </label>
        <input
          className="w-full h-12 px-3 rounded focus:outline-blue-500 font-inter font-normal text-gray-800"
          type="email"
          placeholder="Enter your Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {login.isError && (
          <p className="w-full font-inter font-medium text-left text-red-500">
            {error}
          </p>
        )}
        <button
          className="w-full py-2 bg-blue-500 text-gray-100 rounded hover:bg-blue-400 active:bg-blue-600 disabled:bg-blue-200 disabled:cursor-not-allowed"
          type="submit"
          disabled={login.isPending || email.length === 0 ? true : false}
        >
          {login.isPending ? "Sending..." : "Send"}
        </button>
      </form>
    </article>
  )
}
