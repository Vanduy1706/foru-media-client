import { createContext, useContext } from "react"

const OpenDialogContext = createContext(null)
const SetOpenDialogContext = createContext(null)

export function useOpenDialog() {
  return useContext(OpenDialogContext)
}

export function useSetOpenDialog() {
  return useContext(SetOpenDialogContext)
}

export { OpenDialogContext, SetOpenDialogContext }
