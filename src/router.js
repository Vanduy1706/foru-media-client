import { createBrowserRouter } from "react-router"
import { loginRoute } from "./routes/auth/loginRoute"
import { verificationRoute } from "./routes/auth/verificationRoute"
import { registerRoute } from "./routes/auth/RegisterRoute"
import { homeRoute } from "./routes/home/homeRoute"
import { loginAfterRedirectRoute } from "./routes/auth/loginAfterRedirectRoute"
import NotFound from "./pages/error/NotFound"

const router = createBrowserRouter([
  loginRoute,
  verificationRoute,
  registerRoute,
  homeRoute,
  loginAfterRedirectRoute,
  {
    path: "*",
    element: <NotFound />,
  },
])

export default router
