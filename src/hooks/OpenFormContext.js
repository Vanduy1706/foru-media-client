import { createContext, useContext } from "react"

const OpenFormContext = createContext(null)
const SetOpenFormContext = createContext(null)

export function useOpenForm() {
  return useContext(OpenFormContext)
}

export function useSetOpenForm() {
  return useContext(SetOpenFormContext)
}

export { OpenFormContext, SetOpenFormContext }
