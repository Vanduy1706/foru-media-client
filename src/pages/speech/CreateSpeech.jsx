import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProfileUser } from "../../apis/user/getProfile"
import { useEffect, useState } from "react"
import { useStatus } from "../../hooks/StatusContext"

export default function CreateSpeech() {
  const queryClient = useQueryClient()
  const [content, setContent] = useState("")
  const { addStatus } = useStatus()

  async function createSpeechWithAuthor(content) {
    const result = await fetch(`${process.env.SERVER_URL}/speech`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        content: content,
      }),
    })

    if (!result.ok) {
      const error = await result.json()
      throw new Error(error.message)
    }

    const data = await result.json()
    return data
  }

  const speech = useMutation({
    mutationFn: createSpeechWithAuthor,
    onSuccess: (data, variables) => {
      // queryClient.setQueryData(["forums", { createdAt: null }], (old) => {
      //   if (!old) return
      //   return [data.speech, ...old]
      // })
      addStatus("success")
    },
    onError: (error) => {
      addStatus("failed")
    },
  })

  const profile = useQuery({
    queryKey: ["profileUser"],
    queryFn: getProfileUser,
    staleTime: 1000 * 60 * 5,
  })

  return (
    <div className="w-full h-full p-4 bg-gray-50 relative dark:bg-gray-700">
      <form
        className="w-full flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          speech.mutate(content)
          setContent("")
        }}
      >
        <div className="flex flex-row justify-between items-center">
          <p className="font-inter font-semibold text-gray-700 text-lg dark:text-gray-200">
            Create speech
          </p>
          <button
            className="py-2 px-4 bg-blue-700 text-gray-50 rounded disabled:bg-blue-200 disabled:cursor-not-allowed
            dark:bg-blue-200 dark:text-gray-700 dark:disabled:bg-blue-700"
            type="submit"
            disabled={speech.isPending || content.length === 0 ? true : false}
          >
            {speech.isPending ? <div className="spinner"></div> : "Publish"}
          </button>
        </div>
        <div>
          {profile.isSuccess && (
            <>
              <p className="break-words font-inter font-normal text-base text-gray-700 dark:text-gray-200">
                {profile.data.username}
              </p>
              <p className="break-words font-inter font-normal text-base text-gray-700 dark:text-gray-200">
                @{profile.data.nickname}
              </p>
            </>
          )}
        </div>
        <textarea
          className="bg-gray-100 text-gray-700 focus:outline-blue-500 p-4 dark:bg-gray-600 dark:text-gray-200"
          rows={5}
          cols={40}
          maxLength={200}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </form>
    </div>
  )
}
