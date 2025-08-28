import HomePage from "../../pages/Home/HomePage"
import { markupRoute } from "../markup/markupRoute"
import { notificationRoute } from "../notification/notificationRoute"
import { profileRoute } from "../profile/profileRoute"
import { searchRoute } from "../search/searchRoute"
import { commentDetailRoute } from "./commentDetail"
import { createSpeechRoute } from "./createSpeechRoute"
import { speechDetailRoute } from "./speechDetailRoute"
import { speechRoute } from "./speechRoute"

const homeRoute = {
  path: "/home",
  element: <HomePage />,
  children: [
    speechRoute,
    createSpeechRoute,
    speechDetailRoute,
    commentDetailRoute,
    profileRoute,
    markupRoute,
    notificationRoute,
    searchRoute,
  ],
}

export { homeRoute }
