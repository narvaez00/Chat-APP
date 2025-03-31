"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, PhoneOff, Video, Volume2, VolumeX } from "lucide-react"
import type { WebRTCService, CallInfo } from "@/lib/webrtc-service"

interface IncomingCallProps {
  webRTCService: WebRTCService
  callInfo: CallInfo
  remoteUser: {
    name: string
    avatar: string
  }
  onAccept: () => void
  onReject: () => void
}

export default function IncomingCall({ webRTCService, callInfo, remoteUser, onAccept, onReject }: IncomingCallProps) {
  const [ringtoneEnabled, setRingtoneEnabled] = useState(true)
  const [ringtonePlaying, setRingtonePlaying] = useState(false)
  const [ringtoneAudio, setRingtoneAudio] = useState<HTMLAudioElement | null>(null)

  // Inicializar y reproducir tono de llamada
  useEffect(() => {
    // Crear elemento de audio para el tono de llamada
    const audio = new Audio("/sounds/ringtone.mp3")
    audio.loop = true
    setRingtoneAudio(audio)

    // Reproducir tono si está habilitado
    if (ringtoneEnabled) {
      audio
        .play()
        .then(() => {
          setRingtonePlaying(true)
        })
        .catch((error) => {
          console.error("Error al reproducir tono de llamada:", error)
        })
    }

    // Limpiar al desmontar
    return () => {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [ringtoneEnabled])

  // Alternar tono de llamada
  const toggleRingtone = () => {
    setRingtoneEnabled(!ringtoneEnabled)

    if (ringtoneAudio) {
      if (ringtonePlaying) {
        ringtoneAudio.pause()
        setRingtonePlaying(false)
      } else {
        ringtoneAudio
          .play()
          .then(() => {
            setRingtonePlaying(true)
          })
          .catch((error) => {
            console.error("Error al reproducir tono de llamada:", error)
          })
      }
    }
  }

  // Manejar aceptación de llamada
  const handleAccept = () => {
    // Detener tono de llamada
    if (ringtoneAudio) {
      ringtoneAudio.pause()
      ringtoneAudio.currentTime = 0
    }

    // Aceptar llamada
    webRTCService.acceptCall()
    onAccept()
  }

  // Manejar rechazo de llamada
  const handleReject = () => {
    // Detener tono de llamada
    if (ringtoneAudio) {
      ringtoneAudio.pause()
      ringtoneAudio.currentTime = 0
    }

    // Rechazar llamada
    webRTCService.rejectCall()
    onReject()
  }

  const isVideoCall = callInfo.callType === "video"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{isVideoCall ? "Videollamada entrante" : "Llamada entrante"}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-4 p-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={remoteUser.avatar} />
            <AvatarFallback className="text-3xl">{remoteUser.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>

          <h3 className="text-xl font-semibold">{remoteUser.name}</h3>

          <div className="flex items-center gap-2">
            {isVideoCall ? <Video className="h-5 w-5 text-blue-500" /> : <Phone className="h-5 w-5 text-green-500" />}
            <span>{isVideoCall ? "Videollamada" : "Llamada de voz"}</span>
          </div>

          <div className="mt-2 animate-pulse text-sm text-muted-foreground">Desliza para responder...</div>
        </CardContent>

        <CardFooter className="flex justify-between space-x-4 p-6">
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mb-2 h-12 w-12 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={toggleRingtone}
            >
              {ringtoneEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
            </Button>
            <span className="text-xs">Silencio</span>
          </div>

          <div className="flex flex-col items-center">
            <Button variant="destructive" size="icon" className="mb-2 h-12 w-12 rounded-full" onClick={handleReject}>
              <PhoneOff className="h-6 w-6" />
            </Button>
            <span className="text-xs">Rechazar</span>
          </div>

          <div className="flex flex-col items-center">
            <Button
              variant="default"
              size="icon"
              className="mb-2 h-12 w-12 rounded-full bg-green-500 hover:bg-green-600"
              onClick={handleAccept}
            >
              <Phone className="h-6 w-6" />
            </Button>
            <span className="text-xs">Aceptar</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

