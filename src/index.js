import { RouterProvider } from "react-router"
import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import router from "./router"
import { StatusProvider } from "./hooks/StatusContext"
import { ToggleProvider } from "./hooks/ToggleContext"
import { ThemeProvider } from "./hooks/ThemeContext"

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <StatusProvider>
        <ToggleProvider>
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </ToggleProvider>
      </StatusProvider>
    </QueryClientProvider>
  </StrictMode>
)
