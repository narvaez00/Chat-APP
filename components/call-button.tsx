"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Phone, Video } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { WebRTCService, CallType } from "@/lib/webrtc-service"

interface CallButtonProps {
  webRTCService: WebRTCService
  remoteUserId: string
  onCallStarted: (callType: CallType) => void
  variant?: "icon" | "default"
  size?: "sm" | "default" | "lg"
}

export default function CallButton({
  webRTCService,
  remoteUserId,
  onCallStarted,
  variant = "default",
  size = "default",
}: CallButtonProps) {
  const [isStartingCall, setIsStartingCall] = useState(false)

  // Iniciar llamada de voz
  const startVoiceCall = async () => {
    if (isStartingCall) return

    setIsStartingCall(true)
    try {
      await webRTCService.startCall(remoteUserId, "audio")
      onCallStarted("audio")
    } catch (error) {
      console.error("Error al iniciar llamada de voz:", error)
      alert("No se pudo iniciar la llamada. Verifica los permisos del micrófono.")
    } finally {
      setIsStartingCall(false)
    }
  }

  // Iniciar videollamada
  const startVideoCall = async () => {
    if (isStartingCall) return

    setIsStartingCall(true)
    try {
      await webRTCService.startCall(remoteUserId, "video")
      onCallStarted("video")
    } catch (error) {
      console.error("Error al iniciar videollamada:", error)
      alert("No se pudo iniciar la videollamada. Verifica los permisos de la cámara y el micrófono.")
    } finally {
      setIsStartingCall(false)
    }
  }

  // Renderizar botón según la variante
  if (variant === "icon") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-green-500 hover:bg-green-50 hover:text-green-600"
            disabled={isStartingCall}
          >
            <Phone className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={startVoiceCall} disabled={isStartingCall}>
            <Phone className="mr-2 h-4 w-4" />
            <span>Llamada de voz</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={startVideoCall} disabled={isStartingCall}>
            <Video className="mr-2 h-4 w-4" />
            <span>Videollamada</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Variante por defecto con botones separados
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size={size}
        className="text-green-500 hover:bg-green-50 hover:text-green-600"
        onClick={startVoiceCall}
        disabled={isStartingCall}
      >
        <Phone className="mr-2 h-4 w-4" />
        <span>Llamar</span>
      </Button>

      <Button
        variant="outline"
        size={size}
        className="text-blue-500 hover:bg-blue-50 hover:text-blue-600"
        onClick={startVideoCall}
        disabled={isStartingCall}
      >
        <Video className="mr-2 h-4 w-4" />
        <span>Video</span>
      </Button>
    </div>
  )
}

