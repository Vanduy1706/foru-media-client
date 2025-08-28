import { createContext, useContext, useEffect, useState } from "react"

const ToggleContext = createContext()

export function ToggleProvider({ children }) {
  const [toggle, setToggle] = useState(null)

  useEffect(() => {
    const handleClick = () => setToggle(null)
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  return <ToggleContext value={{ toggle, setToggle }}>{children}</ToggleContext>
}

export function useToggle() {
  return useContext(ToggleContext)
}
