import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSetOpenDialog } from "../../hooks/OpenDialogContext"
import { deleteOneSpeech } from "../../apis/speech/deleteOneSpeech"
import { useSpeechId } from "../../hooks/SpeechContext"
import { useStatus } from "../../hooks/StatusContext"

export default function DeleteSpeechDialog(parameters) {
  const queryClient = useQueryClient()
  const setOpenDialog = useSetOpenDialog()
  const speech = useSpeechId()
  const { addStatus } = useStatus()

  const deleteSpeech = useMutation({
    mutationFn: deleteOneSpeech,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["speechDetail", speech.speechId], (old) => {
        if (!old) return
        return { ...data }
      })
      setOpenDialog(false)
      addStatus("success")
      // queryClient.setQueryData(["speeches"], (old) => {
      //   if (!old) return
      //   return old.map((speech) => {
      //     if (speech._id === data._id) {
      //       return data
      //     } else {
      //       return speech
      //     }
      //   })
      // })
    },
    onError: (error) => {
      setOpenDialog(false)
      addStatus("failed")
    },
  })

  return (
    <>
      <div
        className="w-full h-full absolute bg-gray-700 opacity-75 z-40 dark:bg-gray-200"
        onClick={() => {
          setOpenDialog(false)
        }}
      ></div>
      <div className="w-3/4 h-fit flex flex-col items-center gap-2 absolute z-50 p-4 bg-gray-50 rounded dark:bg-gray-700 sm:w-2/3 lg:w-1/2 xl:w-1/3">
        <p className="text-center font-inter font-normal text-base text-gray-700 dark:text-gray-200">
          Are you sure you want delete this speech?
        </p>
        {deleteSpeech.isPending ? (
          <div className="spinner dark:spinner-dark"></div>
        ) : (
          <div className="flex flex-row gap-4 justify-evenly">
            <p
              className="px-4 py-2 bg-red-200 text-gray-700 rounded cursor-pointer hover:bg-red-100 dark:bg-red-700 dark:text-gray-200 dark:hover:bg-red-600"
              onClick={() => {
                deleteSpeech.mutate(speech.speechId)
              }}
            >
              Yes
            </p>
            <p
              onClick={() => {
                setOpenDialog(false)
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </p>
          </div>
        )}
      </div>
    </>
  )
}
