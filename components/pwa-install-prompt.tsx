"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Detectar si es iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Guardar el evento beforeinstallprompt para usarlo después
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    // Comprobar si la app ya está instalada
    const isAppInstalled = window.matchMedia("(display-mode: standalone)").matches
    if (!isAppInstalled) {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Mostrar el prompt de instalación
    deferredPrompt.prompt()

    // Esperar a que el usuario responda
    const choiceResult = await deferredPrompt.userChoice

    // Ocultar el banner independientemente de la respuesta
    setShowPrompt(false)
    setDeferredPrompt(null)
  }

  const dismissPrompt = () => {
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary text-white p-4 flex items-center justify-between z-50">
      <div>
        {isIOS ? (
          <p>
            Instala esta app: toca <span className="font-bold">Compartir</span> y luego{" "}
            <span className="font-bold">Añadir a pantalla de inicio</span>
          </p>
        ) : (
          <p>Instala esta app para usarla sin conexión</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {!isIOS && (
          <Button variant="outline" className="bg-white text-primary hover:bg-gray-100" onClick={handleInstallClick}>
            Instalar
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-primary-foreground/10"
          onClick={dismissPrompt}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

