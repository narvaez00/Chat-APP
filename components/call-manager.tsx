"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { type WebRTCService, type CallInfo, type CallType, createWebRTCService } from "@/lib/webrtc-service"
import CallInterface from "./call-interface"
import IncomingCall from "./incoming-call"

interface CallManagerProps {
  userId: string
  children: React.ReactNode
}

export default function CallManager({ userId, children }: CallManagerProps) {
  const [webRTCService, setWebRTCService] = useState<WebRTCService | null>(null)
  const [activeCall, setActiveCall] = useState<CallInfo | null>(null)
  const [showCallInterface, setShowCallInterface] = useState(false)
  const [showIncomingCall, setShowIncomingCall] = useState(false)
  const [remoteUserInfo, setRemoteUserInfo] = useState<{
    id: string
    name: string
    avatar: string
  } | null>(null)

  // Inicializar servicio WebRTC
  useEffect(() => {
    if (!userId) return

    const service = createWebRTCService(userId)
    setWebRTCService(service)

    // Configurar escuchas para eventos
    const handleIncomingCall = (callInfo: CallInfo) => {
      setActiveCall(callInfo)
      setShowIncomingCall(true)

      // Buscar información del usuario remoto
      // En una aplicación real, esto vendría de una base de datos o API
      const remoteUser = {
        id: callInfo.remoteUser,
        name: callInfo.remoteUser.split("@")[0] || "Usuario",
        avatar: `https://avatar.vercel.sh/${callInfo.remoteUser}`,
      }
      setRemoteUserInfo(remoteUser)
    }

    const handleCallStateChanged = (callInfo: CallInfo) => {
      setActiveCall(callInfo)

      // Actualizar visibilidad de interfaces según el estado
      if (callInfo.state === "connected" || callInfo.state === "connecting") {
        setShowCallInterface(true)
        setShowIncomingCall(false)
      } else if (callInfo.state === "ended") {
        // Dar tiempo para mostrar el estado "finalizada" antes de cerrar
        setTimeout(() => {
          setShowCallInterface(false)
          setShowIncomingCall(false)
          setActiveCall(null)
        }, 1500)
      }
    }

    const handleCallEnded = () => {
      // La lógica principal está en handleCallStateChanged
    }

    const handleError = (error: { message: string; error?: any }) => {
      console.error("Error en WebRTC:", error.message, error.error)
      alert(`Error: ${error.message}`)
    }

    // Suscribirse a eventos
    service.on("incomingCall", handleIncomingCall)
    service.on("callStateChanged", handleCallStateChanged)
    service.on("callEnded", handleCallEnded)
    service.on("error", handleError)

    // Limpiar al desmontar
    return () => {
      service.removeListener("incomingCall", handleIncomingCall)
      service.removeListener("callStateChanged", handleCallStateChanged)
      service.removeListener("callEnded", handleCallEnded)
      service.removeListener("error", handleError)

      // Finalizar cualquier llamada activa
      const currentCall = service.getCurrentCall()
      if (currentCall) {
        service.endCall()
      }
    }
  }, [userId])

  // Método para iniciar una llamada
  const startCall = (remoteUserId: string, callType: CallType) => {
    if (!webRTCService) return

    // Buscar información del usuario remoto
    // En una aplicación real, esto vendría de una base de datos o API
    const remoteUser = {
      id: remoteUserId,
      name: remoteUserId.split("@")[0] || "Usuario",
      avatar: `https://avatar.vercel.sh/${remoteUserId}`,
    }
    setRemoteUserInfo(remoteUser)

    // Iniciar la llamada
    webRTCService.startCall(remoteUserId, callType)
    setShowCallInterface(true)
  }

  // Manejar aceptación de llamada entrante
  const handleAcceptIncomingCall = () => {
    if (!webRTCService || !activeCall) return
    webRTCService.acceptCall()
    setShowIncomingCall(false)
    setShowCallInterface(true)
  }

  // Manejar rechazo de llamada entrante
  const handleRejectIncomingCall = () => {
    if (!webRTCService || !activeCall) return
    webRTCService.rejectCall()
    setShowIncomingCall(false)
  }

  // Manejar cierre de interfaz de llamada
  const handleCloseCallInterface = () => {
    if (!webRTCService || !activeCall) return

    // Si la llamada aún está activa, finalizarla
    if (["connected", "connecting", "outgoing"].includes(activeCall.state)) {
      webRTCService.endCall()
    }

    setShowCallInterface(false)
  }

  return (
    <>
      {/* Pasar el servicio WebRTC y la función startCall a los hijos */}
      {webRTCService && (
        <WebRTCContext.Provider value={{ webRTCService, startCall }}>{children}</WebRTCContext.Provider>
      )}

      {/* Mostrar interfaz de llamada entrante */}
      {showIncomingCall && webRTCService && activeCall && remoteUserInfo && (
        <IncomingCall
          webRTCService={webRTCService}
          callInfo={activeCall}
          remoteUser={{
            name: remoteUserInfo.name,
            avatar: remoteUserInfo.avatar,
          }}
          onAccept={handleAcceptIncomingCall}
          onReject={handleRejectIncomingCall}
        />
      )}

      {/* Mostrar interfaz de llamada activa */}
      {showCallInterface && webRTCService && remoteUserInfo && (
        <CallInterface webRTCService={webRTCService} onClose={handleCloseCallInterface} remoteUser={remoteUserInfo} />
      )}
    </>
  )
}

// Contexto para acceder al servicio WebRTC desde cualquier componente
import { createContext, useContext } from "react"

interface WebRTCContextType {
  webRTCService: WebRTCService
  startCall: (remoteUserId: string, callType: CallType) => void
}

const WebRTCContext = createContext<WebRTCContextType | null>(null)

// Hook para usar el servicio WebRTC
export function useWebRTC() {
  const context = useContext(WebRTCContext)
  if (!context) {
    throw new Error("useWebRTC debe usarse dentro de un WebRTCProvider")
  }
  return context
}

