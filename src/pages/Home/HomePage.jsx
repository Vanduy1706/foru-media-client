import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Outlet, useNavigate } from "react-router"
import Profile from "./Profile"
import Menu from "./Menu"
import UpdateSpeech from "../speech/UpdateSpeech"
import {
  OpenFormContext,
  SetOpenFormContext,
} from "../../hooks/OpenFormContext"
import {
  OpenDialogContext,
  SetOpenDialogContext,
} from "../../hooks/OpenDialogContext"
import { SpeechProvider } from "../../hooks/SpeechContext"
import { authUser } from "../../apis/auth/authUser"
import { Fragment, useEffect, useRef, useState } from "react"
import DeleteSpeechDialog from "../speech/DeleteSpeechDialog"
import CreateComment from "../comment/CreateComment"
import UpdateComment from "../comment/UpdateComment"
import { CommentProvider } from "../../hooks/CommentContext"
import DeleteCommentDialog from "../comment/DeleteComment"
import CreateReply from "../comment/CreateReply"
import { VoteCountProvider } from "../../hooks/voteCountContext"
import { MarkupProvider } from "../../hooks/markupContext"
import { DatetimeProvider } from "../../hooks/DatetimeContext"
import { ShareProvider } from "../../hooks/shareContext"
import {
  NotificationProvider,
  useNotification,
} from "../../hooks/NotificationContext"
import { useStatus } from "../../hooks/StatusContext"
import Success from "../../components/Success"
import Fail from "../../components/Fail"
import Info from "../../components/Info"
import { useToggle, useVisible } from "../../hooks/ToggleContext"
import Trending from "../speech/TrendingSpeech"

export default function HomePage() {
  const navigation = useNavigate()
  const { status } = useStatus()
  const [openForm, setOpenForm] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)

  const authHandler = useQuery({
    queryKey: ["auth"],
    queryFn: authUser,
    retry: false,
  })

  if (authHandler.isPending) {
    return (
      <div className="w-full h-full bg-gray-700 opacity-20 flex justify-center items-center">
        <p className="font-inter text-3xl font-medium text-gray-50">
          Loading...
        </p>
      </div>
    )
  }

  if (authHandler.isError) {
    navigation("/login/flow/redirect_after_login")
  }

  return (
    <article className="w-full h-full flex flex-row justify-center items-center bg-gray-50 overflow-y-scroll dark:bg-gray-700">
      <SpeechProvider>
        <CommentProvider>
          <OpenFormContext value={openForm}>
            <SetOpenFormContext value={setOpenForm}>
              <OpenDialogContext value={openDialog}>
                <SetOpenDialogContext value={setOpenDialog}>
                  <VoteCountProvider>
                    <MarkupProvider>
                      <ShareProvider>
                        <DatetimeProvider>
                          <NotificationProvider>
                            {status.length > 0 && (
                              <div className="flex flex-col items-end gap-2 m-8 absolute right-0 top-0 z-50">
                                {status.map((stt, i) => (
                                  <Fragment key={i}>
                                    {stt === "success" && (
                                      <Success customMessage={`Success!`} />
                                    )}
                                    {stt === "failed" && (
                                      <Fail customMessage={`Failed!`} />
                                    )}
                                    {stt === "markup" && (
                                      <Info
                                        customMessage={`Added to bookmarks`}
                                      />
                                    )}
                                    {stt === "unMarkup" && (
                                      <Info
                                        customMessage={`Removed bookmark`}
                                      />
                                    )}
                                    {stt === "markup failed" && (
                                      <Fail customMessage={`Failed!`} />
                                    )}
                                    {stt === "markAll" && (
                                      <Info
                                        customMessage={`Marked all notifications`}
                                      />
                                    )}
                                  </Fragment>
                                ))}
                              </div>
                            )}
                            {openForm === "UpdateSpeech" && <UpdateSpeech />}
                            {openForm === "CreateComment" && <CreateComment />}
                            {openForm === "UpdateComment" && <UpdateComment />}
                            {openForm === "CreateReply" && <CreateReply />}
                            {openDialog === "DeleteSpeech" && (
                              <DeleteSpeechDialog />
                            )}
                            {openDialog === "DeleteComment" && (
                              <DeleteCommentDialog />
                            )}
                            <div className="w-full h-full flex flex-row bg-gray-50 overflow-y-hidden border-r-2 sm:w-3/4 md:w-2/3 lg:w-1/2 dark:bg-gray-700 dark:border-gray-600">
                              <header className="w-fit h-full flex flex-col gap-2 border-x-2 sticky top-0 dark:bg-gray-700 dark:border-gray-600">
                                <Profile />
                                <Menu />
                              </header>
                              <Outlet />
                            </div>
                            <Trending />
                          </NotificationProvider>
                        </DatetimeProvider>
                      </ShareProvider>
                    </MarkupProvider>
                  </VoteCountProvider>
                </SetOpenDialogContext>
              </OpenDialogContext>
            </SetOpenFormContext>
          </OpenFormContext>
        </CommentProvider>
      </SpeechProvider>
    </article>
  )
}
