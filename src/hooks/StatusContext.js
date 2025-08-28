const { createContext, useState, useContext, useEffect } = require("react")

const StatusContext = createContext()

export function StatusProvider({ children }) {
  const [status, setStatus] = useState([])

  function addStatus(message) {
    setStatus((prev) => [message, ...prev])
  }

  useEffect(() => {
    if (status.length === 0) return

    const interval = setInterval(() => {
      setStatus((prev) => {
        if (prev.length === 0) {
          return []
        } else {
          const newArr = [...prev]
          newArr.pop()
          return newArr
        }
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [status])

  return <StatusContext value={{ status, addStatus }}>{children}</StatusContext>
}

export function useStatus() {
  return useContext(StatusContext)
}
