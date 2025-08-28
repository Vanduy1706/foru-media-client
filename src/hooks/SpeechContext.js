import { createContext, useContext, useState } from "react"

const SpeechIdContext = createContext(null)

const SetSpeechIdContext = createContext(null)

export function SpeechProvider({ children }) {
  const [speechId, setSpeechId] = useState(null)

  return (
    <SpeechIdContext value={speechId}>
      <SetSpeechIdContext value={setSpeechId}>{children}</SetSpeechIdContext>
    </SpeechIdContext>
  )
}

export function useSpeech() {
  return useContext(SetSpeechIdContext)
}

export function useSpeechId() {
  return useContext(SpeechIdContext)
}
