"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Establecer el estado inicial
    setIsOnline(navigator.onLine)

    // Añadir event listeners para cambios en la conexión
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white p-2 flex items-center justify-center z-50">
      <WifiOff className="h-4 w-4 mr-2" />
      <span className="text-sm">Sin conexión - Modo offline</span>
    </div>
  )
}

