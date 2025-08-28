import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSpeech, useSpeechId } from "../../hooks/SpeechContext"
import { getDetailSpeech } from "../../apis/speech/getDetailSpeech"
import { getProfileUser } from "../../apis/user/getProfile"
import { Fragment, useState } from "react"
import { useSetOpenForm } from "../../hooks/OpenFormContext"
import { useSetOpenDialog } from "../../hooks/OpenDialogContext"
import { useNavigate, useParams } from "react-router"
import { getCommentOnSpeech } from "../../apis/comment/getCommentOnSpeech"
import Comment from "../../components/Comment"
import { voteSpeechOrComment } from "../../apis/vote/voteSpeechOrComment"
import { useVote } from "../../hooks/voteCountContext"
import { getMarkUp } from "../../apis/markup/getMarkUp"
import { useMarkup } from "../../hooks/markupContext"
import { getVote } from "../../apis/vote/getVote"
import { useFormatter } from "../../hooks/DatetimeContext"
import { useShare } from "../../hooks/shareContext"
import { getShare } from "../../apis/share/getShare"
import { useToggle } from "../../hooks/ToggleContext"
import { useTheme } from "../../hooks/ThemeContext"

export default function SpeechDetail() {
  const { id } = useParams()
  const navigation = useNavigate()
  const setOpenForm = useSetOpenForm()
  const setOpenDialog = useSetOpenDialog()
  const setSpeechId = useSpeech()
  // const [toggle, setToggle] = useState(null)
  const formatter = useFormatter()
  const vote = useVote()
  const markup = useMarkup()
  const share = useShare()
  const [sortValue, setSortValue] = useState("newest")
  const { toggle, setToggle } = useToggle()
  const { theme, toggleTheme } = useTheme()

  // function toggleHandler(commentId) {
  //   if (toggle) {
  //     setToggle("")
  //   } else {
  //     setToggle(commentId)
  //   }
  // }

  const speechDetail = useQuery({
    queryKey: ["speechDetail", id],
    queryFn: () => getDetailSpeech(id),
    staleTime: 1000 * 60 * 1,
    retry: false,
  })

  const profile = useQuery({
    queryKey: ["profileUser"],
    queryFn: getProfileUser,
    staleTime: 1000 * 60 * 5,
    retry: false,
  })

  const comments = useQuery({
    queryKey: ["comments", { id, sortType: sortValue }],
    queryFn: () => getCommentOnSpeech({ id, sortType: sortValue }),
    staleTime: 1000 * 60 * 1,
    retry: false,
  })

  const markupDetail = useQuery({
    queryKey: ["markupDetail", id],
    queryFn: () => getMarkUp(id),
  })

  const voteDetail = useQuery({
    queryKey: ["voteDetail", id],
    queryFn: () => getVote(id),
  })

  const shareDetail = useQuery({
    queryKey: ["shareDetail", id],
    queryFn: () => getShare(id),
  })

  if (speechDetail.isError) {
    navigation("/notfound")
  }

  return (
    <div className="w-full flex flex-col overflow-y-scroll">
      {speechDetail.isPending && (
        <div className="skeleton-paragraph dark:skeleton-paragraph-dark"></div>
      )}

      {speechDetail.isError && (
        <p className="w-full">{speechDetail.error.message}</p>
      )}

      {speechDetail.isSuccess && (
        <div
          className="w-full h-fit flex flex-col gap-2 py-4 border-b-2 border-gray-300 dark:border-gray-600"
          key={id}
        >
          {speechDetail.data.isSoftDeleted ? (
            <p className="font-inter font-semibold text-gray-700 text-xl px-4 dark:text-gray-200">
              This speech is deleted
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <div className="px-4 flex flex-row justify-between items-center">
                  <div className="flex flex-col">
                    <p className="w-52 font-inter font-semibold text-gray-700 break-words dark:text-gray-200">
                      {speechDetail.data.author.username.length >= 30
                        ? `${speechDetail.data.author.username.slice(0, 30)}...`
                        : `${speechDetail.data.author.username}`}
                    </p>
                    <p className="w-52 font-inter font-medium text-gray-500 break-words dark:text-gray-400">
                      @
                      {speechDetail.data.author.nickname.length >= 30
                        ? `${speechDetail.data.author.nickname.slice(0, 30)}...`
                        : `${speechDetail.data.author.nickname}`}
                    </p>
                  </div>
                  <div className="relative">
                    <div
                      className="w-fit cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        setToggle((prev) =>
                          prev === speechDetail.data._id
                            ? null
                            : speechDetail.data._id
                        )
                      }}
                    >
                      <div className="px-4 py-2 hover:bg-blue-100 rounded-full dark:hover:bg-blue-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="4"
                          height="20"
                          viewBox="0 0 4 20"
                          fill="none"
                        >
                          <path
                            d="M2 16C3.10457 16 4 16.8954 4 18C4 19.1046 3.10457 20 2 20C0.895431 20 0 19.1046 0 18C0 16.8954 0.895431 16 2 16ZM2 8C3.10457 8 4 8.89543 4 10C4 11.1046 3.10457 12 2 12C0.895431 12 0 11.1046 0 10C0 8.89543 0.895431 8 2 8ZM2 0C3.10457 0 4 0.895431 4 2C4 3.10457 3.10457 4 2 4C0.895431 4 0 3.10457 0 2C0 0.895431 0.895431 0 2 0Z"
                            fill={`${
                              theme === "light" ? "#374151" : "#e5e7eb"
                            }`}
                          />
                        </svg>
                      </div>
                      {speechDetail.data._id === toggle && (
                        <div className="flex flex-col py-4 bg-blue-100 rounded absolute top-8 left-0 -translate-x-full dark:bg-blue-700">
                          {profile.data._id ===
                            speechDetail.data.author._id && (
                            <div className="">
                              <div
                                className="py-2 px-4 hover:bg-blue-50 cursor-pointer dark:hover:bg-blue-600"
                                onClick={(e) => {
                                  setOpenForm("UpdateSpeech")
                                  setSpeechId({
                                    speechId: speechDetail.data._id,
                                    content: speechDetail.data.content,
                                  })
                                }}
                              >
                                <p className="block w-28 text-gray-700 dark:text-gray-200">
                                  Update speech
                                </p>
                              </div>
                              <div
                                className="py-2 px-4 hover:bg-blue-50 cursor-pointer dark:hover:bg-blue-600"
                                onClick={(e) => {
                                  setOpenDialog("DeleteSpeech")
                                  setSpeechId({
                                    speechId: speechDetail.data._id,
                                  })
                                }}
                              >
                                <p className="block w-28 text-gray-700 dark:text-gray-200">
                                  Delete speech
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="py-2 px-4 hover:bg-blue-50 cursor-pointer dark:hover:bg-blue-600">
                            <p className="block w-28 text-gray-700 dark:text-gray-200">
                              Coming soon...
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-4">
                  <p className="font-inter font-normal text-gray-700 text-justify dark:text-gray-200">
                    {speechDetail.data.content}
                  </p>
                </div>
              </div>
              <div className="flex flex-row justify-between pt-2 px-4">
                <div className="flex flex-rows gap-2 items-center">
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      vote.mutate({
                        targetType: "speech",
                        targetId: speechDetail.data._id,
                      })
                    }}
                  >
                    {voteDetail.isSuccess && voteDetail.data ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <mask id="path-1-inside-1_33_38" fill="white">
                          <path d="M11.2793 0.202148C11.6364 -0.0682281 12.1303 -0.0684066 12.4873 0.202148L23.3682 8.44824C24.1317 9.02723 23.722 10.2451 22.7637 10.2451H18.8828C18.3306 10.2452 17.8828 10.6929 17.8828 11.2451V22.7451C17.8827 23.2973 17.435 23.7451 16.8828 23.7451H6.88281C6.33069 23.745 5.88294 23.2972 5.88281 22.7451V11.2451C5.88281 10.6928 5.4351 10.2451 4.88281 10.2451H1.00195C0.0434847 10.2451 -0.365493 9.02713 0.398438 8.44824L11.2793 0.202148Z" />
                        </mask>
                        <path
                          d="M11.2793 0.202148C11.6364 -0.0682281 12.1303 -0.0684066 12.4873 0.202148L23.3682 8.44824C24.1317 9.02723 23.722 10.2451 22.7637 10.2451H18.8828C18.3306 10.2452 17.8828 10.6929 17.8828 11.2451V22.7451C17.8827 23.2973 17.435 23.7451 16.8828 23.7451H6.88281C6.33069 23.745 5.88294 23.2972 5.88281 22.7451V11.2451C5.88281 10.6928 5.4351 10.2451 4.88281 10.2451H1.00195C0.0434847 10.2451 -0.365493 9.02713 0.398438 8.44824L11.2793 0.202148Z"
                          fill={`${theme === "light" ? "#374151" : "#e5e7eb"}`}
                        />
                        <path
                          d="M11.2793 0.202148L10.3739 -0.993774L10.3733 -0.99333L11.2793 0.202148ZM12.4873 0.202148L13.3933 -0.99333L13.3932 -0.993377L12.4873 0.202148ZM23.3682 8.44824L24.2745 7.25303L24.2742 7.25276L23.3682 8.44824ZM18.8828 10.2451L18.8828 8.74512L18.8825 8.74512L18.8828 10.2451ZM17.8828 22.7451L19.3828 22.7455V22.7451H17.8828ZM6.88281 23.7451L6.88253 25.2451H6.88281V23.7451ZM5.88281 22.7451L4.38281 22.7451L4.38281 22.7455L5.88281 22.7451ZM1.00195 10.2451L1.00189 11.7451H1.00195V10.2451ZM0.398438 8.44824L1.30437 9.64377L1.30443 9.64372L0.398438 8.44824ZM11.2793 0.202148L12.1847 1.39807C12.0068 1.53279 11.7605 1.53343 11.5814 1.39767L12.4873 0.202148L13.3932 -0.993377C12.5 -1.67024 11.2661 -1.66924 10.3739 -0.993774L11.2793 0.202148ZM12.4873 0.202148L11.5813 1.39763L22.4622 9.64372L23.3682 8.44824L24.2742 7.25276L13.3933 -0.99333L12.4873 0.202148ZM23.3682 8.44824L22.4618 9.64346C22.0794 9.35349 22.2852 8.74512 22.7637 8.74512V10.2451V11.7451C25.1589 11.7451 26.184 8.70097 24.2745 7.25303L23.3682 8.44824ZM22.7637 10.2451V8.74512H18.8828V10.2451V11.7451H22.7637V10.2451ZM18.8828 10.2451L18.8825 8.74512C17.5024 8.74537 16.3828 9.86419 16.3828 11.2451H17.8828H19.3828C19.3828 11.5216 19.1588 11.7451 18.8831 11.7451L18.8828 10.2451ZM17.8828 11.2451H16.3828V22.7451H17.8828H19.3828V11.2451H17.8828ZM17.8828 22.7451L16.3828 22.7448C16.3829 22.4691 16.6063 22.2451 16.8828 22.2451V23.7451V25.2451C18.2638 25.2451 19.3825 24.1255 19.3828 22.7455L17.8828 22.7451ZM16.8828 23.7451V22.2451H6.88281V23.7451V25.2451H16.8828V23.7451ZM6.88281 23.7451L6.88309 22.2451C7.15924 22.2452 7.38275 22.4688 7.38281 22.7448L5.88281 22.7451L4.38281 22.7455C4.38312 24.1257 5.50215 25.2449 6.88253 25.2451L6.88281 23.7451ZM5.88281 22.7451H7.38281V11.2451H5.88281H4.38281V22.7451H5.88281ZM5.88281 11.2451H7.38281C7.38281 9.86441 6.26352 8.74512 4.88281 8.74512V10.2451V11.7451C4.60667 11.7451 4.38281 11.5213 4.38281 11.2451H5.88281ZM4.88281 10.2451V8.74512H1.00195V10.2451V11.7451H4.88281V10.2451ZM1.00195 10.2451L1.00202 8.74512C1.48255 8.74514 1.68532 9.3551 1.30437 9.64377L0.398438 8.44824L-0.507498 7.25272C-2.41631 8.69916 -1.39558 11.745 1.00189 11.7451L1.00195 10.2451ZM0.398438 8.44824L1.30443 9.64372L12.1853 1.39763L11.2793 0.202148L10.3733 -0.99333L-0.50756 7.25276L0.398438 8.44824Z"
                          fill={`${theme === "light" ? "#374151" : "#e5e7eb"}`}
                          mask="url(#path-1-inside-1_33_38)"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <mask id="path-1-inside-1_33_38" fill="white">
                          <path d="M11.2793 0.202148C11.6364 -0.0682281 12.1303 -0.0684066 12.4873 0.202148L23.3682 8.44824C24.1317 9.02723 23.722 10.2451 22.7637 10.2451H18.8828C18.3306 10.2452 17.8828 10.6929 17.8828 11.2451V22.7451C17.8827 23.2973 17.435 23.7451 16.8828 23.7451H6.88281C6.33069 23.745 5.88294 23.2972 5.88281 22.7451V11.2451C5.88281 10.6928 5.4351 10.2451 4.88281 10.2451H1.00195C0.0434847 10.2451 -0.365493 9.02713 0.398438 8.44824L11.2793 0.202148Z" />
                        </mask>
                        <path
                          d="M11.2793 0.202148C11.6364 -0.0682281 12.1303 -0.0684066 12.4873 0.202148L23.3682 8.44824C24.1317 9.02723 23.722 10.2451 22.7637 10.2451H18.8828C18.3306 10.2452 17.8828 10.6929 17.8828 11.2451V22.7451C17.8827 23.2973 17.435 23.7451 16.8828 23.7451H6.88281C6.33069 23.745 5.88294 23.2972 5.88281 22.7451V11.2451C5.88281 10.6928 5.4351 10.2451 4.88281 10.2451H1.00195C0.0434847 10.2451 -0.365493 9.02713 0.398438 8.44824L11.2793 0.202148Z"
                          fill="none"
                        />
                        <path
                          d="M11.2793 0.202148L10.3739 -0.993774L10.3733 -0.99333L11.2793 0.202148ZM12.4873 0.202148L13.3933 -0.99333L13.3932 -0.993377L12.4873 0.202148ZM23.3682 8.44824L24.2745 7.25303L24.2742 7.25276L23.3682 8.44824ZM18.8828 10.2451L18.8828 8.74512L18.8825 8.74512L18.8828 10.2451ZM17.8828 22.7451L19.3828 22.7455V22.7451H17.8828ZM6.88281 23.7451L6.88253 25.2451H6.88281V23.7451ZM5.88281 22.7451L4.38281 22.7451L4.38281 22.7455L5.88281 22.7451ZM1.00195 10.2451L1.00189 11.7451H1.00195V10.2451ZM0.398438 8.44824L1.30437 9.64377L1.30443 9.64372L0.398438 8.44824ZM11.2793 0.202148L12.1847 1.39807C12.0068 1.53279 11.7605 1.53343 11.5814 1.39767L12.4873 0.202148L13.3932 -0.993377C12.5 -1.67024 11.2661 -1.66924 10.3739 -0.993774L11.2793 0.202148ZM12.4873 0.202148L11.5813 1.39763L22.4622 9.64372L23.3682 8.44824L24.2742 7.25276L13.3933 -0.99333L12.4873 0.202148ZM23.3682 8.44824L22.4618 9.64346C22.0794 9.35349 22.2852 8.74512 22.7637 8.74512V10.2451V11.7451C25.1589 11.7451 26.184 8.70097 24.2745 7.25303L23.3682 8.44824ZM22.7637 10.2451V8.74512H18.8828V10.2451V11.7451H22.7637V10.2451ZM18.8828 10.2451L18.8825 8.74512C17.5024 8.74537 16.3828 9.86419 16.3828 11.2451H17.8828H19.3828C19.3828 11.5216 19.1588 11.7451 18.8831 11.7451L18.8828 10.2451ZM17.8828 11.2451H16.3828V22.7451H17.8828H19.3828V11.2451H17.8828ZM17.8828 22.7451L16.3828 22.7448C16.3829 22.4691 16.6063 22.2451 16.8828 22.2451V23.7451V25.2451C18.2638 25.2451 19.3825 24.1255 19.3828 22.7455L17.8828 22.7451ZM16.8828 23.7451V22.2451H6.88281V23.7451V25.2451H16.8828V23.7451ZM6.88281 23.7451L6.88309 22.2451C7.15924 22.2452 7.38275 22.4688 7.38281 22.7448L5.88281 22.7451L4.38281 22.7455C4.38312 24.1257 5.50215 25.2449 6.88253 25.2451L6.88281 23.7451ZM5.88281 22.7451H7.38281V11.2451H5.88281H4.38281V22.7451H5.88281ZM5.88281 11.2451H7.38281C7.38281 9.86441 6.26352 8.74512 4.88281 8.74512V10.2451V11.7451C4.60667 11.7451 4.38281 11.5213 4.38281 11.2451H5.88281ZM4.88281 10.2451V8.74512H1.00195V10.2451V11.7451H4.88281V10.2451ZM1.00195 10.2451L1.00202 8.74512C1.48255 8.74514 1.68532 9.3551 1.30437 9.64377L0.398438 8.44824L-0.507498 7.25272C-2.41631 8.69916 -1.39558 11.745 1.00189 11.7451L1.00195 10.2451ZM0.398438 8.44824L1.30443 9.64372L12.1853 1.39763L11.2793 0.202148L10.3733 -0.99333L-0.50756 7.25276L0.398438 8.44824Z"
                          fill={`${theme === "light" ? "#374151" : "#e5e7eb"}`}
                          mask="url(#path-1-inside-1_33_38)"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="font-inter font-normal text-base text-gray-700 dark:text-gray-200">
                    {speechDetail.data.voteCount}
                  </p>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setOpenForm("CreateComment")
                      setSpeechId({ speechId: speechDetail.data._id })
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M23 0C23.5523 0 24 0.447715 24 1V22.4424L23.9873 22.6074C23.8706 23.3498 22.9761 23.6996 22.3867 23.2334L22.2656 23.1211L18 18.5L15.9893 16.3213C15.8236 16.142 15.5988 16.031 15.3584 16.0059L15.2549 16H1L0.897461 15.9951C0.393331 15.9438 0 15.5177 0 15V1C0 0.447715 0.447715 2.57702e-07 1 0H23ZM1.5 14.5H15.2549C15.8652 14.5001 16.4513 14.723 16.9053 15.1221L17.0918 15.3047L19.1025 17.4824L22.5 21.1631V1.5H1.5V14.5ZM6 6C7.10457 6 8 6.89543 8 8C8 9.10457 7.10457 10 6 10C4.89543 10 4 9.10457 4 8C4 6.89543 4.89543 6 6 6ZM12 6C13.1046 6 14 6.89543 14 8C14 9.10457 13.1046 10 12 10C10.8954 10 10 9.10457 10 8C10 6.89543 10.8954 6 12 6ZM18 6C19.1046 6 20 6.89543 20 8C20 9.10457 19.1046 10 18 10C16.8954 10 16 9.10457 16 8C16 6.89543 16.8954 6 18 6Z"
                        fill={`${theme === "light" ? "#374151" : "#e5e7eb"}`}
                      />
                    </svg>
                  </div>
                  <p className="font-inter font-normal text-base text-gray-700 dark:text-gray-200">
                    {speechDetail.data.commentCount}
                  </p>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <div
                    className="cursor-pointer"
                    onClick={(e) => {
                      share.mutate({
                        targetType: "speech",
                        targetId: speechDetail.data._id,
                      })
                    }}
                  >
                    {shareDetail.isSuccess && shareDetail.data ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="15"
                        viewBox="0 0 24 19"
                        fill="none"
                      >
                        <path
                          d="M21.5773 16.418C21.5773 17.4255 20.7606 18.2422 19.7531 18.2422H3.33512V16.418H19.7531V7.29688H21.5773V16.418ZM6.21305 11.4014C6.61502 11.4015 6.81993 11.8841 6.54117 12.1738L3.66324 15.1641C3.48383 15.3505 3.18543 15.3505 3.00602 15.1641L0.128087 12.1738C-0.150436 11.8841 0.0551938 11.4014 0.457189 11.4014H6.21305ZM20.6652 1.82422H4.24723V10.9453H2.42301V1.82422C2.42301 0.81673 3.23973 3.21982e-06 4.24723 0H20.6652V1.82422ZM20.3371 3.07812C20.5165 2.89174 20.8149 2.8917 20.9943 3.07812L23.8713 6.06836C24.15 6.35809 23.9452 6.84081 23.5431 6.84082H17.7873C17.3853 6.84068 17.1804 6.35805 17.4591 6.06836L20.3371 3.07812Z"
                          fill={`${theme === "light" ? "#ff0032" : "#ffc5dc"}`}
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="15"
                        viewBox="0 0 24 19"
                        fill="none"
                      >
                        <path
                          d="M21.5773 16.418C21.5773 17.4255 20.7606 18.2422 19.7531 18.2422H3.33512V16.418H19.7531V7.29688H21.5773V16.418ZM6.21305 11.4014C6.61502 11.4015 6.81993 11.8841 6.54117 12.1738L3.66324 15.1641C3.48383 15.3505 3.18543 15.3505 3.00602 15.1641L0.128087 12.1738C-0.150436 11.8841 0.0551938 11.4014 0.457189 11.4014H6.21305ZM20.6652 1.82422H4.24723V10.9453H2.42301V1.82422C2.42301 0.81673 3.23973 3.21982e-06 4.24723 0H20.6652V1.82422ZM20.3371 3.07812C20.5165 2.89174 20.8149 2.8917 20.9943 3.07812L23.8713 6.06836C24.15 6.35809 23.9452 6.84081 23.5431 6.84082H17.7873C17.3853 6.84068 17.1804 6.35805 17.4591 6.06836L20.3371 3.07812Z"
                          fill={`${theme === "light" ? "#374151" : "#e5e7eb"}`}
                        />
                      </svg>
                    )}
                  </div>
                  <p className="font-inter font-normal text-base text-gray-700 dark:text-gray-200">
                    {speechDetail.data.shareCount}
                  </p>
                </div>
                <div className="flex flex-row gap-2 items-center cursor-pointer">
                  {markupDetail.isPending && <></>}
                  {markupDetail.isSuccess && markupDetail.data ? (
                    <>
                      <div
                        onClick={() => {
                          markup.mutate({
                            targetType: "speech",
                            targetId: id,
                          })
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="23"
                          viewBox="0 0 18 23"
                          fill="none"
                        >
                          <path
                            d="M1 0.75H17C17.1381 0.75 17.25 0.861929 17.25 1V21.6797C17.25 21.8989 16.9876 22.0127 16.8281 21.8623L10.2012 15.6035C9.52676 14.9666 8.47324 14.9666 7.79883 15.6035L1.17188 21.8623C1.01243 22.0127 0.75 21.8989 0.75 21.6797V1C0.75 0.861929 0.861929 0.75 1 0.75Z"
                            fill={`${
                              theme === "light" ? "#8ab7f9" : "#b2daf9"
                            }`}
                            stroke={`${
                              theme === "light" ? "#8ab7f9" : "#b2daf9"
                            }`}
                            stroke-width="1.5"
                          />
                        </svg>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        onClick={() => {
                          markup.mutate({
                            targetType: "speech",
                            targetId: id,
                          })
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="23"
                          viewBox="0 0 18 23"
                          fill="none"
                        >
                          <path
                            d="M1 0.75H17C17.1381 0.75 17.25 0.861929 17.25 1V21.6797C17.25 21.8989 16.9876 22.0127 16.8281 21.8623L10.2012 15.6035C9.52676 14.9666 8.47324 14.9666 7.79883 15.6035L1.17188 21.8623C1.01243 22.0127 0.75 21.8989 0.75 21.6797V1C0.75 0.861929 0.861929 0.75 1 0.75Z"
                            fill="none"
                            stroke={`${
                              theme === "light" ? "#374151" : "#e5e7eb"
                            }`}
                            stroke-width="1.5"
                          />
                        </svg>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="px-4 pt-2">
                <p className="font-inter font-medium text-gray-600 dark:text-gray-300">
                  &bull; {formatter(speechDetail.data.createdAt)}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex flex-row pt-4 pl-4 pr-4 justify-between items-center bg-gray-100 dark:bg-gray-700">
        <p className="font-inter font-semibold text-lg text-gray-700 dark:text-gray-200">
          Comment
        </p>
        <select
          className="px-2 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-500"
          id="sort-speech"
          value={sortValue}
          onChange={(e) => {
            e.preventDefault()
            setSortValue(e.target.value)
          }}
        >
          <option value={`newest`}>Newest</option>
          <option value={`oldest`}>Oldest</option>
        </select>
      </div>
      {comments.isPending && (
        <div className="w-full h-full bg-gray-50 flex justify-center m-4 dark:bg-gray-700">
          <div className="w-fit h-fit p-2 rounded-full bg-gray-50 drop-shadow-lg dark:bg-gray-700">
            <div className="spinner dark:spinner-dark"></div>
          </div>
        </div>
      )}

      {comments.isSuccess &&
        comments.data.map((comment, index) => (
          <Fragment key={index}>
            <Comment
              commentId={comment._id}
              // toggle={toggle}
              // toggleHandler={toggleHandler}
            />
          </Fragment>
        ))}
    </div>
  )
}
