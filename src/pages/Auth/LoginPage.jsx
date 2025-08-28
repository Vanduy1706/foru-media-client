import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router"

export default function LoginPage() {
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

  const authHandler = useQuery({
    queryKey: ["auth"],
    queryFn: authUser,
    retry: false,
  })

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

  if (authHandler.isPending) {
    return (
      <div className="w-full h-full bg-gray-800 opacity-20 flex justify-center items-center">
        <p className="font-inter text-3xl font-medium text-gray-50">
          Loading...
        </p>
      </div>
    )
  }

  if (authHandler.isSuccess) {
    navigate("/home")
  }

  return (
    <article className="w-full h-full flex justify-center items-center bg-gray-50">
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
        <p className="font-inter font-normal text-base text-gray-400 text-center">
          Welcome to{" "}
          <span className="text-blue-500 text-xl font-medium">Foru</span> social
          network. If you want freedom of speech, please join us via{" "}
          <span className="text-xl text-gray-500 font-bold">Email</span> below.
          I want to listen to your thoughts.
        </p>
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
          className="w-full flex justify-center py-2 bg-blue-500 text-gray-100 rounded hover:bg-blue-400 active:bg-blue-600 disabled:bg-blue-200 disabled:cursor-not-allowed"
          type="submit"
          disabled={login.isPending || email.length === 0 ? true : false}
        >
          {login.isPending ? <div className="spinner"></div> : "Send"}
        </button>
      </form>
    </article>
  )
}
