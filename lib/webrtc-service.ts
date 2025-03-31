// Servicio para manejar conexiones WebRTC
import { EventEmitter } from "events"

// Configuración de servidores STUN/TURN para atravesar NAT
const ICE_SERVERS = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
}

// Tipos de eventos para la señalización
export type SignalingEvent =
  | { type: "offer"; offer: RTCSessionDescriptionInit; from: string; to: string }
  | { type: "answer"; answer: RTCSessionDescriptionInit; from: string; to: string }
  | { type: "candidate"; candidate: RTCIceCandidateInit; from: string; to: string }
  | { type: "hangup"; from: string; to: string }
  | { type: "callRequest"; from: string; to: string; callType: "audio" | "video" }
  | { type: "callAccepted"; from: string; to: string }
  | { type: "callRejected"; from: string; to: string; reason?: string }

// Estado de la llamada
export type CallState =
  | "idle" // Sin llamada activa
  | "outgoing" // Llamada saliente, esperando respuesta
  | "incoming" // Llamada entrante, esperando respuesta
  | "connecting" // Conectando la llamada
  | "connected" // Llamada conectada
  | "reconnecting" // Reconectando después de una interrupción
  | "ended" // Llamada finalizada

// Tipo de llamada
export type CallType = "audio" | "video"

// Información de la llamada
export interface CallInfo {
  callId: string
  remoteUser: string
  callType: CallType
  startTime?: number
  endTime?: number
  state: CallState
  localStream?: MediaStream
  remoteStream?: MediaStream
}

// Clase principal para manejar WebRTC
export class WebRTCService extends EventEmitter {
  private peerConnection: RTCPeerConnection | null = null
  private localStream: MediaStream | null = null
  private remoteStream: MediaStream | null = null
  private currentCall: CallInfo | null = null
  private userId: string
  private signalingService: SignalingService

  constructor(userId: string, signalingService: SignalingService) {
    super()
    this.userId = userId
    this.signalingService = signalingService
    this.setupSignalingListeners()
  }

  // Configurar escuchas para eventos de señalización
  private setupSignalingListeners() {
    this.signalingService.on("signalingEvent", async (event: SignalingEvent) => {
      // Solo procesar eventos dirigidos a este usuario
      if (event.to !== this.userId) return

      switch (event.type) {
        case "callRequest":
          this.handleIncomingCall(event)
          break
        case "callAccepted":
          this.handleCallAccepted(event)
          break
        case "callRejected":
          this.handleCallRejected(event)
          break
        case "offer":
          this.handleOffer(event)
          break
        case "answer":
          this.handleAnswer(event)
          break
        case "candidate":
          this.handleCandidate(event)
          break
        case "hangup":
          this.handleRemoteHangup(event)
          break
      }
    })
  }

  // Iniciar una llamada a otro usuario
  public async startCall(remoteUserId: string, callType: CallType): Promise<void> {
    try {
      // Crear un ID único para la llamada
      const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Solicitar permisos y obtener stream local
      const stream = await this.getLocalMedia(callType)
      this.localStream = stream

      // Crear información de la llamada
      this.currentCall = {
        callId,
        remoteUser: remoteUserId,
        callType,
        state: "outgoing",
        localStream: stream,
      }

      // Emitir evento de cambio de estado
      this.emit("callStateChanged", this.currentCall)

      // Enviar solicitud de llamada
      this.signalingService.send({
        type: "callRequest",
        from: this.userId,
        to: remoteUserId,
        callType,
      })
    } catch (error) {
      console.error("Error al iniciar llamada:", error)
      this.emit("error", { message: "No se pudo iniciar la llamada", error })
      this.resetCall()
    }
  }

  // Aceptar una llamada entrante
  public async acceptCall(): Promise<void> {
    if (!this.currentCall || this.currentCall.state !== "incoming") {
      throw new Error("No hay llamada entrante para aceptar")
    }

    try {
      // Obtener stream local si aún no lo tenemos
      if (!this.localStream) {
        this.localStream = await this.getLocalMedia(this.currentCall.callType)
        this.currentCall.localStream = this.localStream
      }

      // Actualizar estado
      this.currentCall.state = "connecting"
      this.emit("callStateChanged", this.currentCall)

      // Enviar aceptación
      this.signalingService.send({
        type: "callAccepted",
        from: this.userId,
        to: this.currentCall.remoteUser,
      })

      // Iniciar conexión WebRTC
      await this.setupPeerConnection()

      // Crear y enviar oferta
      await this.createAndSendOffer()
    } catch (error) {
      console.error("Error al aceptar llamada:", error)
      this.emit("error", { message: "No se pudo aceptar la llamada", error })
      this.endCall()
    }
  }

  // Rechazar una llamada entrante
  public rejectCall(reason?: string): void {
    if (!this.currentCall || this.currentCall.state !== "incoming") {
      throw new Error("No hay llamada entrante para rechazar")
    }

    // Enviar rechazo
    this.signalingService.send({
      type: "callRejected",
      from: this.userId,
      to: this.currentCall.remoteUser,
      reason,
    })

    // Resetear estado
    this.resetCall()
  }

  // Finalizar una llamada activa
  public endCall(): void {
    if (!this.currentCall) return

    // Enviar hangup si la llamada estaba conectada o en proceso
    if (["connecting", "connected", "outgoing"].includes(this.currentCall.state)) {
      this.signalingService.send({
        type: "hangup",
        from: this.userId,
        to: this.currentCall.remoteUser,
      })
    }

    // Limpiar recursos
    this.cleanupCall()
  }

  // Alternar micrófono (mute/unmute)
  public toggleMicrophone(enabled: boolean): void {
    if (!this.localStream) return

    this.localStream.getAudioTracks().forEach((track) => {
      track.enabled = enabled
    })

    this.emit("microphoneToggled", enabled)
  }

  // Alternar cámara (enable/disable)
  public toggleCamera(enabled: boolean): void {
    if (!this.localStream) return

    this.localStream.getVideoTracks().forEach((track) => {
      track.enabled = enabled
    })

    this.emit("cameraToggled", enabled)
  }

  // Cambiar entre cámara frontal y trasera (móvil)
  public async switchCamera(): Promise<void> {
    if (!this.localStream) return

    // Obtener la pista de video actual
    const videoTrack = this.localStream.getVideoTracks()[0]
    if (!videoTrack) return

    // Obtener las capacidades del dispositivo
    const capabilities = videoTrack.getCapabilities()

    // Verificar si el dispositivo admite cambio de cámara
    if (!capabilities.facingMode) {
      this.emit("error", { message: "Este dispositivo no admite cambio de cámara" })
      return
    }

    // Obtener la configuración actual
    const settings = videoTrack.getSettings()
    const currentFacingMode = settings.facingMode

    // Determinar el nuevo modo
    const newFacingMode = currentFacingMode === "user" ? "environment" : "user"

    try {
      // Detener la pista actual
      videoTrack.stop()

      // Obtener nueva pista con la cámara opuesta
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacingMode },
        audio: true,
      })

      const newVideoTrack = newStream.getVideoTracks()[0]

      // Reemplazar la pista en el stream local
      this.localStream.removeTrack(videoTrack)
      this.localStream.addTrack(newVideoTrack)

      // Reemplazar la pista en la conexión peer si existe
      if (this.peerConnection) {
        const senders = this.peerConnection.getSenders()
        const videoSender = senders.find((sender) => sender.track && sender.track.kind === "video")

        if (videoSender) {
          videoSender.replaceTrack(newVideoTrack)
        }
      }

      this.emit("cameraSwitched", newFacingMode)
    } catch (error) {
      console.error("Error al cambiar cámara:", error)
      this.emit("error", { message: "No se pudo cambiar la cámara", error })
    }
  }

  // Obtener el estado actual de la llamada
  public getCurrentCall(): CallInfo | null {
    return this.currentCall
  }

  // Manejar una solicitud de llamada entrante
  private handleIncomingCall(event: SignalingEvent & { type: "callRequest" }): void {
    // Si ya hay una llamada activa, rechazar automáticamente
    if (this.currentCall && ["connected", "connecting", "outgoing", "incoming"].includes(this.currentCall.state)) {
      this.signalingService.send({
        type: "callRejected",
        from: this.userId,
        to: event.from,
        reason: "busy",
      })
      return
    }

    // Crear información de llamada entrante
    const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.currentCall = {
      callId,
      remoteUser: event.from,
      callType: event.callType,
      state: "incoming",
    }

    // Notificar sobre la llamada entrante
    this.emit("incomingCall", this.currentCall)
    this.emit("callStateChanged", this.currentCall)
  }

  // Manejar cuando el remoto acepta nuestra llamada
  private async handleCallAccepted(event: SignalingEvent & { type: "callAccepted" }): Promise<void> {
    if (!this.currentCall || this.currentCall.state !== "outgoing" || this.currentCall.remoteUser !== event.from) {
      return
    }

    try {
      // Actualizar estado
      this.currentCall.state = "connecting"
      this.emit("callStateChanged", this.currentCall)

      // Configurar conexión WebRTC
      await this.setupPeerConnection()

      // Esperar a que el remoto envíe su oferta
    } catch (error) {
      console.error("Error al procesar aceptación de llamada:", error)
      this.emit("error", { message: "Error al establecer la conexión", error })
      this.endCall()
    }
  }

  // Manejar cuando el remoto rechaza nuestra llamada
  private handleCallRejected(event: SignalingEvent & { type: "callRejected" }): void {
    if (!this.currentCall || this.currentCall.state !== "outgoing" || this.currentCall.remoteUser !== event.from) {
      return
    }

    // Notificar rechazo
    this.emit("callRejected", {
      remoteUser: event.from,
      reason: event.reason || "rejected",
    })

    // Limpiar recursos
    this.resetCall()
  }

  // Manejar oferta SDP recibida
  private async handleOffer(event: SignalingEvent & { type: "offer" }): Promise<void> {
    if (!this.currentCall || this.currentCall.remoteUser !== event.from) {
      return
    }

    try {
      // Asegurarse de que tenemos una conexión peer
      if (!this.peerConnection) {
        await this.setupPeerConnection()
      }

      // Establecer la descripción remota (oferta)
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(event.offer))

      // Crear respuesta
      const answer = await this.peerConnection.createAnswer()
      await this.peerConnection.setLocalDescription(answer)

      // Enviar respuesta
      this.signalingService.send({
        type: "answer",
        from: this.userId,
        to: event.from,
        answer: answer,
      })
    } catch (error) {
      console.error("Error al procesar oferta:", error)
      this.emit("error", { message: "Error al procesar oferta", error })
      this.endCall()
    }
  }

  // Manejar respuesta SDP recibida
  private async handleAnswer(event: SignalingEvent & { type: "answer" }): Promise<void> {
    if (!this.peerConnection || !this.currentCall || this.currentCall.remoteUser !== event.from) {
      return
    }

    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(event.answer))
    } catch (error) {
      console.error("Error al procesar respuesta:", error)
      this.emit("error", { message: "Error al procesar respuesta", error })
      this.endCall()
    }
  }

  // Manejar candidato ICE recibido
  private async handleCandidate(event: SignalingEvent & { type: "candidate" }): Promise<void> {
    if (!this.peerConnection || !this.currentCall || this.currentCall.remoteUser !== event.from) {
      return
    }

    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(event.candidate))
    } catch (error) {
      console.error("Error al agregar candidato ICE:", error)
      // No terminamos la llamada por errores de candidatos ICE, ya que algunos pueden fallar normalmente
    }
  }

  // Manejar cuando el remoto finaliza la llamada
  private handleRemoteHangup(event: SignalingEvent & { type: "hangup" }): void {
    if (!this.currentCall || this.currentCall.remoteUser !== event.from) {
      return
    }

    // Notificar que el remoto colgó
    this.emit("remoteHangup", { remoteUser: event.from })

    // Limpiar recursos
    this.cleanupCall()
  }

  // Configurar la conexión peer WebRTC
  private async setupPeerConnection(): Promise<void> {
    if (!this.currentCall) return

    // Crear nueva conexión RTCPeerConnection
    this.peerConnection = new RTCPeerConnection(ICE_SERVERS)

    // Configurar stream remoto
    this.remoteStream = new MediaStream()
    this.currentCall.remoteStream = this.remoteStream

    // Escuchar eventos de la conexión peer
    this.setupPeerConnectionListeners()

    // Agregar tracks locales a la conexión peer
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection!.addTrack(track, this.localStream!)
      })
    }
  }

  // Configurar escuchas para eventos de la conexión peer
  private setupPeerConnectionListeners(): void {
    if (!this.peerConnection) return

    // Manejar candidatos ICE
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.currentCall) {
        this.signalingService.send({
          type: "candidate",
          from: this.userId,
          to: this.currentCall.remoteUser,
          candidate: event.candidate.toJSON(),
        })
      }
    }

    // Manejar cambios de estado de conexión ICE
    this.peerConnection.oniceconnectionstatechange = () => {
      if (!this.peerConnection || !this.currentCall) return

      const state = this.peerConnection.iceConnectionState
      console.log("ICE connection state:", state)

      switch (state) {
        case "connected":
        case "completed":
          if (this.currentCall.state !== "connected") {
            this.currentCall.state = "connected"
            this.currentCall.startTime = Date.now()
            this.emit("callStateChanged", this.currentCall)
          }
          break
        case "failed":
        case "disconnected":
          if (this.currentCall.state === "connected") {
            this.currentCall.state = "reconnecting"
            this.emit("callStateChanged", this.currentCall)
            // Intentar reconectar automáticamente
            this.peerConnection.restartIce()
          }
          break
        case "closed":
          this.cleanupCall()
          break
      }
    }

    // Manejar tracks remotos
    this.peerConnection.ontrack = (event) => {
      if (!this.remoteStream || !this.currentCall) return

      // Agregar tracks remotos al stream remoto
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream!.addTrack(track)
      })

      this.emit("remoteStreamUpdated", this.remoteStream)
    }
  }

  // Crear y enviar oferta SDP
  private async createAndSendOffer(): Promise<void> {
    if (!this.peerConnection || !this.currentCall) return

    try {
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: this.currentCall.callType === "video",
      })

      await this.peerConnection.setLocalDescription(offer)

      this.signalingService.send({
        type: "offer",
        from: this.userId,
        to: this.currentCall.remoteUser,
        offer: offer,
      })
    } catch (error) {
      console.error("Error al crear oferta:", error)
      this.emit("error", { message: "Error al crear oferta", error })
      this.endCall()
    }
  }

  // Obtener stream local (audio/video)
  private async getLocalMedia(callType: CallType): Promise<MediaStream> {
    const constraints: MediaStreamConstraints = {
      audio: true,
      video: callType === "video" ? { facingMode: "user" } : false,
    }

    try {
      return await navigator.mediaDevices.getUserMedia(constraints)
    } catch (error) {
      console.error("Error al obtener medios locales:", error)
      throw error
    }
  }

  // Limpiar recursos de la llamada
  private cleanupCall(): void {
    // Guardar información de finalización
    if (this.currentCall) {
      this.currentCall.state = "ended"
      this.currentCall.endTime = Date.now()
      this.emit("callStateChanged", this.currentCall)
      this.emit("callEnded", this.currentCall)
    }

    // Detener tracks locales
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
    }

    // Cerrar conexión peer
    if (this.peerConnection) {
      this.peerConnection.close()
    }

    // Resetear variables
    this.resetCall()
  }

  // Resetear variables de llamada
  private resetCall(): void {
    this.peerConnection = null
    this.localStream = null
    this.remoteStream = null
    this.currentCall = null
  }
}

// Servicio de señalización (simulado para este ejemplo)
export class SignalingService extends EventEmitter {
  private connectedUsers: Set<string> = new Set()

  constructor() {
    super()

    // Simular conexión al servidor de señalización
    setTimeout(() => {
      this.emit("connected")
    }, 1000)
  }

  // Registrar un usuario
  public register(userId: string): void {
    this.connectedUsers.add(userId)
    console.log(`Usuario ${userId} registrado en el servicio de señalización`)
  }

  // Enviar mensaje de señalización
  public send(event: SignalingEvent): void {
    console.log("Enviando evento de señalización:", event)

    // Simular latencia de red
    setTimeout(
      () => {
        // Emitir evento para que lo reciba el destinatario
        this.emit("signalingEvent", event)
      },
      200 + Math.random() * 300,
    )
  }

  // Obtener usuarios conectados
  public getConnectedUsers(): string[] {
    return Array.from(this.connectedUsers)
  }
}

// Crear instancia del servicio de señalización
export const createSignalingService = (): SignalingService => {
  return new SignalingService()
}

// Crear instancia del servicio WebRTC
export const createWebRTCService = (userId: string): WebRTCService => {
  const signalingService = createSignalingService()
  signalingService.register(userId)
  return new WebRTCService(userId, signalingService)
}

