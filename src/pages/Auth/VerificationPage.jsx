import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router"

export default function VerificationPage() {
  const navigation = useNavigate()
  const [code, setCode] = useState()
  const [error, setError] = useState("")

  async function handlerVerification(code) {
    const result = await fetch(`${process.env.SERVER_URL}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        verifiedCode: parseInt(code),
      }),
    })

    const data = await result.json()
    if (!result.ok) {
      throw new Error(data.message)
    }

    return data
  }

  const verify = useMutation({
    mutationFn: handlerVerification,
    onSuccess: (data) => {
      navigation(data.redirectTo)
    },
    onError: (error) => {
      if (error.message === "login failed") {
        navigation("/")
      }
      setError(error.message)
    },
  })

  return (
    <article className="w-full h-full flex justify-center items-center bg-gray-50">
      <form
        className="w-4/5 h-fit flex flex-col gap-2 items-center bg-gray-100 p-5 drop-shadow-md rounded-md"
        onSubmit={(e) => {
          e.preventDefault()
          verify.mutate(code)
        }}
      >
        <label className="font-inter font-semibold text-gray-500 text-2xl">
          Verification code
        </label>
        <p className="font-inter font-normal text-base text-gray-400 text-center">
          Please{" "}
          <span className="underline text-blue-500">check your email</span> for
          the verification code. Then enter the code in the field below to
          verify your email.
        </p>
        <input
          className="w-full h-12 px-3 rounded focus:outline-blue-500 font-inter font-normal text-gray-800"
          type="number"
          placeholder="Enter your code"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        {verify.isError && (
          <p className="w-full font-inter font-medium text-left text-red-500">
            {error}
          </p>
        )}
        <button
          className="w-full flex justify-center py-2 bg-blue-500 text-gray-100 rounded hover:bg-blue-400 active:bg-blue-600 disabled:bg-blue-200 disabled:cursor-not-allowed"
          type="submit"
          disabled={verify.isPending || !code ? true : false}
        >
          {verify.isPending ? <div className="spinner"></div> : "Verify"}
        </button>
      </form>
    </article>
  )
}
