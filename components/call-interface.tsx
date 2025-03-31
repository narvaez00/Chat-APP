"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PhoneOff, Mic, MicOff, Video, VideoOff, CameraIcon as FlipCamera, Volume2, VolumeX } from "lucide-react"
import type { WebRTCService, CallInfo } from "@/lib/webrtc-service"

interface CallInterfaceProps {
  webRTCService: WebRTCService
  onClose: () => void
  remoteUser: {
    id: string
    name: string
    avatar: string
  }
}

export default function CallInterface({ webRTCService, onClose, remoteUser }: CallInterfaceProps) {
  const [callInfo, setCallInfo] = useState<CallInfo | null>(null)
  const [micEnabled, setMicEnabled] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [speakerEnabled, setSpeakerEnabled] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Inicializar estado de la llamada
  useEffect(() => {
    const currentCall = webRTCService.getCurrentCall()
    setCallInfo(currentCall)

    // Configurar escuchas para eventos de WebRTC
    const handleCallStateChanged = (updatedCall: CallInfo) => {
      setCallInfo(updatedCall)

      // Iniciar temporizador cuando la llamada se conecta
      if (updatedCall.state === "connected" && !durationIntervalRef.current) {
        durationIntervalRef.current = setInterval(() => {
          setCallDuration((prev) => prev + 1)
        }, 1000)
      }

      // Detener temporizador cuando la llamada termina
      if (updatedCall.state === "ended" && durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
        durationIntervalRef.current = null
      }
    }

    const handleRemoteStreamUpdated = (stream: MediaStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream
      }
    }

    const handleCallEnded = () => {
      setTimeout(() => {
        onClose()
      }, 1500)
    }

    // Suscribirse a eventos
    webRTCService.on("callStateChanged", handleCallStateChanged)
    webRTCService.on("remoteStreamUpdated", handleRemoteStreamUpdated)
    webRTCService.on("callEnded", handleCallEnded)

    // Configurar video local
    if (currentCall?.localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = currentCall.localStream
    }

    // Configurar video remoto
    if (currentCall?.remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = currentCall.remoteStream
    }

    // Limpiar al desmontar
    return () => {
      webRTCService.removeListener("callStateChanged", handleCallStateChanged)
      webRTCService.removeListener("remoteStreamUpdated", handleRemoteStreamUpdated)
      webRTCService.removeListener("callEnded", handleCallEnded)

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }
    }
  }, [webRTCService, onClose])

  // Manejar cambios en el stream local
  useEffect(() => {
    if (callInfo?.localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = callInfo.localStream
    }
  }, [callInfo?.localStream])

  // Manejar cambios en el stream remoto
  useEffect(() => {
    if (callInfo?.remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = callInfo.remoteStream
    }
  }, [callInfo?.remoteStream])

  // Formatear duración de la llamada
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Manejar clic en botón de colgar
  const handleHangup = () => {
    webRTCService.endCall()
  }

  // Alternar micrófono
  const toggleMicrophone = () => {
    const newState = !micEnabled
    setMicEnabled(newState)
    webRTCService.toggleMicrophone(newState)
  }

  // Alternar cámara
  const toggleCamera = () => {
    const newState = !cameraEnabled
    setCameraEnabled(newState)
    webRTCService.toggleCamera(newState)
  }

  // Alternar altavoz
  const toggleSpeaker = () => {
    const newState = !speakerEnabled
    setSpeakerEnabled(newState)

    // Implementar lógica para cambiar el dispositivo de salida de audio
    if (remoteVideoRef.current) {
      // Esta API aún no está completamente soportada en todos los navegadores
      // @ts-ignore
      if (remoteVideoRef.current.setSinkId) {
        // @ts-ignore
        remoteVideoRef.current
          .setSinkId(newState ? "" : "default")
          .catch((error) => console.error("Error al cambiar dispositivo de audio:", error))
      }
    }
  }

  // Cambiar entre cámara frontal y trasera
  const handleSwitchCamera = () => {
    webRTCService.switchCamera()
  }

  // Alternar pantalla completa
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error al intentar mostrar pantalla completa: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  // Determinar el estado de la interfaz de llamada
  const getCallStatusText = (): string => {
    if (!callInfo) return "Iniciando llamada..."

    switch (callInfo.state) {
      case "outgoing":
        return `Llamando a ${remoteUser.name}...`
      case "incoming":
        return `Llamada entrante de ${remoteUser.name}...`
      case "connecting":
        return "Conectando llamada..."
      case "connected":
        return formatDuration(callDuration)
      case "reconnecting":
        return "Reconectando..."
      case "ended":
        return "Llamada finalizada"
      default:
        return "Llamada"
    }
  }

  // Renderizar interfaz según el tipo de llamada
  const isVideoCall = callInfo?.callType === "video"

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black ${isFullscreen ? "fullscreen" : ""}`}>
      {/* Fondo de video remoto (para llamadas de video) */}
      {isVideoCall && (
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          muted={!speakerEnabled}
        />
      )}

      {/* Contenido principal */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-between p-4">
        {/* Cabecera con información de la llamada */}
        <div className="w-full rounded-lg bg-black/50 p-4 text-white backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={remoteUser.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {remoteUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{remoteUser.name}</h3>
                <p className="text-sm opacity-80">{getCallStatusText()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Área central (avatar o video local) */}
        <div className="flex flex-1 items-center justify-center">
          {!isVideoCall && (
            <Avatar className="h-32 w-32 md:h-48 md:w-48">
              <AvatarImage src={remoteUser.avatar} />
              <AvatarFallback className="text-4xl">{remoteUser.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Video local (para llamadas de video) */}
        {isVideoCall && (
          <div className="absolute bottom-24 right-4 h-36 w-24 overflow-hidden rounded-lg border-2 border-white shadow-lg md:h-48 md:w-36">
            <video ref={localVideoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
          </div>
        )}

        {/* Controles de llamada */}
        <div className="w-full max-w-md rounded-full bg-black/70 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-around">
            {/* Botón de micrófono */}
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${micEnabled ? "bg-gray-700 text-white" : "bg-red-500 text-white"}`}
              onClick={toggleMicrophone}
            >
              {micEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
            </Button>

            {/* Botón de colgar */}
            <Button
              variant="destructive"
              size="icon"
              className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600"
              onClick={handleHangup}
            >
              <PhoneOff className="h-6 w-6" />
            </Button>

            {/* Botón de video (solo para videollamadas) */}
            {isVideoCall && (
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${cameraEnabled ? "bg-gray-700 text-white" : "bg-red-500 text-white"}`}
                onClick={toggleCamera}
              >
                {cameraEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
              </Button>
            )}

            {/* Botón de altavoz */}
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${speakerEnabled ? "bg-gray-700 text-white" : "bg-gray-500 text-white"}`}
              onClick={toggleSpeaker}
            >
              {speakerEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
            </Button>

            {/* Botón para cambiar cámara (solo en videollamadas) */}
            {isVideoCall && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-gray-700 text-white"
                onClick={handleSwitchCamera}
              >
                <FlipCamera className="h-6 w-6" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

