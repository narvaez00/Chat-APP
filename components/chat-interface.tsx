"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Send,
  Menu,
  Search,
  Phone,
  Video,
  MoreVertical,
  User,
  LogOut,
  Settings,
  Paperclip,
  Users,
  Globe,
  MessageSquare,
  ArrowLeft,
  Camera,
  Mic,
  Trash,
  Trash2,
  Ban,
  Flag,
  BarChart2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ConversationList from "./conversation-list"
import MessageList, { type Message, type PollData } from "./message-list"
import AttachmentMenu from "./attachment-menu"
import VoiceRecorder from "./voice-recorder"
import CameraCapture from "./camera-capture"
import PollCreator from "./poll-creator"
import AIChat from "./ai-chat"
import { useTranslation } from "@/lib/i18n/use-translation"
import { updateUser } from "@/lib/auth-service"
import { useMobile } from "@/hooks/use-mobile"

// Importar los componentes de llamadas
import CallManager, { useWebRTC } from "./call-manager"

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 15)

// Helper function to get current time formatted
const getCurrentTime = () => {
  const now = new Date()
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

// Modificar la función principal para envolver todo en CallManager
export default function ChatInterface() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [showPollCreator, setShowPollCreator] = useState(false)
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({})
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [showAIChat, setShowAIChat] = useState(false)
  // Añadir después de los otros estados
  const [blockedUsers, setBlockedUsers] = useState<string[]>([])
  // Corregir el uso de useMobile - no desestructurar como array
  const isMobile = useMobile()
  const messageInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { t } = useTranslation()

  // Initialize messages for each chat
  useEffect(() => {
    // Check if user is logged in
    const email = localStorage.getItem("user-email")
    const name = localStorage.getItem("user-name")
    const image = localStorage.getItem("user-profile-image")

    if (!email) {
      router.push("/")
      return
    }

    setUserEmail(email)
    setUserName(name || email.split("@")[0])

    // Asegurarse de que la imagen se cargue correctamente
    if (image) {
      setProfileImage(image)
    } else {
      const defaultImage = `https://avatar.vercel.sh/${email}`
      setProfileImage(defaultImage)
      localStorage.setItem("user-profile-image", defaultImage)
    }

    // Check if there's a selected chat from contacts or search
    const selectedChatFromStorage = localStorage.getItem("selected-chat")
    if (selectedChatFromStorage) {
      setSelectedChat(selectedChatFromStorage)
      localStorage.removeItem("selected-chat") // Clear it after use
    }

    // Initialize messages from localStorage if available
    const savedMessages = localStorage.getItem("chat-messages")
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
    // Añadir dentro del primer useEffect, después de cargar los mensajes
    // Initialize blocked users from localStorage if available
    const savedBlockedUsers = localStorage.getItem("blocked-users")
    if (savedBlockedUsers) {
      setBlockedUsers(JSON.parse(savedBlockedUsers))
    }
  }, [router])

  // Save messages to localStorage when they change
  useEffect(() => {
    if (Object.keys(messages).length > 0) {
      localStorage.setItem("chat-messages", JSON.stringify(messages))
    }
  }, [messages])

  // Save blocked users to localStorage when they change
  useEffect(() => {
    if (blockedUsers.length > 0) {
      localStorage.setItem("blocked-users", JSON.stringify(blockedUsers))
    } else {
      localStorage.removeItem("blocked-users")
    }
  }, [blockedUsers])

  // Simulate auto-response after a delay
  const simulateResponse = useCallback(
    (chatId: string) => {
      // First show typing indicator
      setIsTyping((prev) => ({ ...prev, [chatId]: true }))

      // Random delay between 1-3 seconds
      const typingDelay = Math.floor(Math.random() * 2000) + 1000

      // After the typing delay, send the message
      setTimeout(() => {
        const responseOptions = [
          "Ok, entendido.",
          "¡Claro que sí!",
          "Gracias por la información.",
          "¿Podemos hablar más tarde?",
          "Estoy de acuerdo contigo.",
          "Interesante, cuéntame más.",
          "¿A qué hora nos vemos?",
          "Perfecto, nos vemos pronto.",
          "¿Necesitas algo más?",
          "Estoy ocupado ahora, te escribo después.",
        ]

        const responseText = responseOptions[Math.floor(Math.random() * responseOptions.length)]

        const newMessage: Message = {
          id: generateId(),
          sender: chatId,
          text: responseText,
          timestamp: getCurrentTime(),
          type: "text",
          status: "sent",
          isNew: true,
        }

        setMessages((prev) => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), newMessage],
        }))

        // Remove typing indicator
        setIsTyping((prev) => ({ ...prev, [chatId]: false }))

        // Update message status to "read" after a delay
        setTimeout(() => {
          setMessages((prev) => {
            const chatMessages = [...(prev[chatId] || [])]
            const userMessages = chatMessages.filter((msg) => msg.sender === userEmail && msg.status !== "read")

            if (userMessages.length > 0) {
              return {
                ...prev,
                [chatId]: chatMessages.map((msg) =>
                  msg.sender === userEmail && msg.status !== "read" ? { ...msg, status: "read" } : msg,
                ),
              }
            }

            return prev
          })
        }, 1000)
      }, typingDelay)
    },
    [userEmail],
  )

  // Reemplazar la función handleBlockUser existente con esta:
  // Función para bloquear/desbloquear usuario
  const handleBlockUser = () => {
    if (!selectedChat) return

    const isBlocked = blockedUsers.includes(selectedChat)

    if (isBlocked) {
      // Desbloquear usuario
      if (confirm(`¿Estás seguro de que quieres desbloquear a ${selectedChat.split("@")[0]}?`)) {
        setBlockedUsers((prev) => prev.filter((user) => user !== selectedChat))
        alert(`Has desbloqueado a ${selectedChat.split("@")[0]}`)
      }
    } else {
      // Bloquear usuario
      if (confirm(`¿Estás seguro de que quieres bloquear a ${selectedChat.split("@")[0]}?`)) {
        setBlockedUsers((prev) => [...prev, selectedChat])
        alert(`Has bloqueado a ${selectedChat.split("@")[0]}`)
      }
    }
  }

  // Modificar el inicio de la función handleSendMessage:
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !selectedChat) return

    // Verificar si el usuario está bloqueado
    if (blockedUsers.includes(selectedChat)) {
      alert(`No puedes enviar mensajes a ${selectedChat.split("@")[0]} porque está bloqueado.`)
      return
    }

    // Create new message
    const newMessage: Message = {
      id: generateId(),
      sender: userEmail!,
      text: message,
      timestamp: getCurrentTime(),
      type: "text",
      status: "sent",
    }

    // Add message to state
    setMessages((prev) => {
      const updatedMessages = {
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), newMessage],
      }
      return updatedMessages
    })

    // Clear input
    setMessage("")

    // Update message status after a delay (simulate delivery)
    setTimeout(() => {
      setMessages((prev) => {
        const chatMessages = [...(prev[selectedChat] || [])]
        const messageIndex = chatMessages.findIndex((msg) => msg.id === newMessage.id)

        if (messageIndex !== -1) {
          chatMessages[messageIndex] = {
            ...chatMessages[messageIndex],
            status: "delivered",
          }
        }

        return {
          ...prev,
          [selectedChat]: chatMessages,
        }
      })
    }, 1000)

    // Simulate response after a random delay
    const responseDelay = Math.floor(Math.random() * 3000) + 2000
    setTimeout(() => {
      simulateResponse(selectedChat)
    }, responseDelay)
  }

  const handleMessageRead = (messageId: string) => {
    if (!selectedChat) return

    setMessages((prev) => {
      const chatMessages = [...(prev[selectedChat] || [])]
      const messageIndex = chatMessages.findIndex((msg) => msg.id === messageId)

      if (messageIndex !== -1) {
        chatMessages[messageIndex] = {
          ...chatMessages[messageIndex],
          isNew: false,
        }
      }

      return {
        ...prev,
        [selectedChat]: chatMessages,
      }
    })
  }

  const handleTyping = () => {
    // If user is typing, show typing indicator to the other user
    if (selectedChat && message.trim()) {
      // Clear previous timeout if exists
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }

      // Set new timeout to clear typing indicator after 2 seconds of inactivity
      const timeout = setTimeout(() => {
        // This would normally be sent to a server to notify the other user
        console.log("User stopped typing")
      }, 2000)

      setTypingTimeout(timeout)
    }
  }

  const handleLogout = () => {
    // Save profile data before logout
    if (userEmail && (userName || profileImage)) {
      updateUser(userEmail, {
        email: userEmail,
        password: "", // We don't know the password here, so we don't update it
        name: userName || undefined,
        profileImage: profileImage || undefined,
      })
    }

    localStorage.removeItem("user-email")
    localStorage.removeItem("user-name")
    localStorage.removeItem("user-profile-image")
    router.push("/")
  }

  const goToProfile = () => {
    router.push("/profile")
  }

  const goToContacts = () => {
    router.push("/contacts")
  }

  const goToSearch = () => {
    router.push("/search")
  }

  const toggleAttachmentMenu = () => {
    setShowAttachmentMenu(!showAttachmentMenu)
    setShowVoiceRecorder(false)
  }

  const toggleVoiceRecorder = () => {
    setShowVoiceRecorder(!showVoiceRecorder)
    setShowAttachmentMenu(false)
  }

  const toggleCamera = () => {
    setShowCamera(!showCamera)
    setShowAttachmentMenu(false)
    setShowVoiceRecorder(false)
  }

  const togglePollCreator = () => {
    setShowPollCreator(!showPollCreator)
  }

  const handleAttachment = (type: string, data?: any) => {
    if (!selectedChat) return

    setShowAttachmentMenu(false)

    // Crear mensaje según el tipo de adjunto
    let attachmentMessage: Message

    if (type === "location") {
      attachmentMessage = {
        id: generateId(),
        sender: userEmail!,
        text: "Ubicación compartida",
        timestamp: getCurrentTime(),
        type: "location",
        locationData: data, // Datos de latitud y longitud
      }
    } else if (type === "photo" || type === "camera") {
      attachmentMessage = {
        id: generateId(),
        sender: userEmail!,
        text: "Imagen compartida",
        timestamp: getCurrentTime(),
        type: "image",
        fileUrl: `https://picsum.photos/seed/${Math.random()}/300/200}`,
        status: "sent",
      }
    } else if (type === "audio" || type === "music") {
      attachmentMessage = {
        id: generateId(),
        sender: userEmail!,
        text: "Audio compartido",
        timestamp: getCurrentTime(),
        type: "audio",
        status: "sent",
        audioData: data, // URL, nombre y tamaño del archivo
      }
    } else {
      attachmentMessage = {
        id: generateId(),
        sender: userEmail!,
        text: `${type} compartido`,
        timestamp: getCurrentTime(),
        type: "file",
        fileName: `${type}-${Date.now()}.${type === "document" ? "pdf" : "file"}`,
        status: "sent",
      }
    }

    // Add message to state
    setMessages((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), attachmentMessage],
    }))

    // Simulate response after a random delay
    const responseDelay = Math.floor(Math.random() * 3000) + 2000
    setTimeout(() => {
      simulateResponse(selectedChat)
    }, responseDelay)
  }

  // Manejar la grabación de voz
  const handleVoiceRecording = (audioBlob: Blob) => {
    if (!selectedChat) return

    setShowVoiceRecorder(false)

    // Crear URL para el audio grabado
    const audioUrl = URL.createObjectURL(audioBlob)

    // Crear mensaje de audio
    const audioMessage: Message = {
      id: generateId(),
      sender: userEmail!,
      text: "Nota de voz",
      timestamp: getCurrentTime(),
      type: "audio",
      status: "sent",
      audioData: {
        url: audioUrl,
        name: "Nota de voz.webm",
        size: audioBlob.size,
      },
    }

    // Añadir mensaje al estado
    setMessages((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), audioMessage],
    }))

    // Simular respuesta después de un retraso aleatorio
    const responseDelay = Math.floor(Math.random() * 3000) + 2000
    setTimeout(() => {
      simulateResponse(selectedChat)
    }, responseDelay)
  }

  // Manejar la captura de cámara
  const handleCameraCapture = (imageBlob: Blob) => {
    if (!selectedChat) return

    setShowCamera(false)

    // Crear URL para la imagen capturada
    const imageUrl = URL.createObjectURL(imageBlob)

    // Crear mensaje de imagen
    const imageMessage: Message = {
      id: generateId(),
      sender: userEmail!,
      text: "Foto capturada",
      timestamp: getCurrentTime(),
      type: "image",
      fileUrl: imageUrl,
      status: "sent",
    }

    // Añadir mensaje al estado
    setMessages((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), imageMessage],
    }))

    // Simular respuesta después de un retraso aleatorio
    const responseDelay = Math.floor(Math.random() * 3000) + 2000
    setTimeout(() => {
      simulateResponse(selectedChat)
    }, responseDelay)
  }

  // Manejar la creación de encuestas
  const handleCreatePoll = (pollData: PollData) => {
    if (!selectedChat) return

    setShowPollCreator(false)

    // Añadir contadores de votos a las opciones
    const optionsWithVotes = pollData.options.map((option) => ({
      ...option,
      votes: 0,
      voters: [],
    }))

    // Crear mensaje de encuesta
    const pollMessage: Message = {
      id: generateId(),
      sender: userEmail!,
      text: "Encuesta: " + pollData.question,
      timestamp: getCurrentTime(),
      type: "poll",
      status: "sent",
      pollData: {
        ...pollData,
        options: optionsWithVotes,
        totalVotes: 0,
      },
    }

    // Añadir mensaje al estado
    setMessages((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), pollMessage],
    }))

    // Simular respuesta después de un retraso aleatorio
    const responseDelay = Math.floor(Math.random() * 3000) + 2000
    setTimeout(() => {
      simulateResponse(selectedChat)
    }, responseDelay)
  }

  // Manejar votos en encuestas
  const handlePollVote = (messageId: string, optionId: string) => {
    if (!selectedChat || !userEmail) return

    setMessages((prev) => {
      const chatMessages = [...(prev[selectedChat] || [])]
      const messageIndex = chatMessages.findIndex((msg) => msg.id === messageId)

      if (messageIndex === -1 || !chatMessages[messageIndex].pollData) return prev

      const message = chatMessages[messageIndex]
      const pollData = message.pollData!

      // Verificar si el usuario ya votó
      const userVoted = pollData.userVote !== undefined

      if (userVoted) return prev // No permitir cambiar el voto

      // Actualizar los votos
      const updatedOptions = pollData.options.map((option) => {
        if (option.id === optionId) {
          return {
            ...option,
            votes: (option.votes || 0) + 1,
            voters: [...(option.voters || []), userEmail],
          }
        }
        return option
      })

      const updatedPollData = {
        ...pollData,
        options: updatedOptions,
        totalVotes: (pollData.totalVotes || 0) + 1,
        userVote: optionId,
      }

      chatMessages[messageIndex] = {
        ...message,
        pollData: updatedPollData,
      }

      return {
        ...prev,
        [selectedChat]: chatMessages,
      }
    })
  }

  // Función para vaciar el chat
  const handleClearChat = () => {
    if (!selectedChat) return

    if (confirm(`¿Estás seguro de que quieres vaciar el chat con ${selectedChat.split("@")[0]}?`)) {
      setMessages((prev) => ({
        ...prev,
        [selectedChat]: [],
      }))
    }
  }

  // Función para reportar usuario
  const handleReportUser = () => {
    if (!selectedChat) return

    const reason = prompt(`¿Por qué quieres reportar a ${selectedChat.split("@")[0]}?`)
    if (reason) {
      // Aquí iría la lógica para enviar el reporte
      // Por ahora solo mostramos una alerta
      alert(`Has reportado a ${selectedChat.split("@")[0]} por: ${reason}`)
    }
  }

  // Función para eliminar chat
  const handleDeleteChat = () => {
    if (!selectedChat) return

    if (confirm(`¿Estás seguro de que quieres eliminar el chat con ${selectedChat.split("@")[0]}?`)) {
      // Eliminar el chat del estado
      setMessages((prev) => {
        const newMessages = { ...prev }
        delete newMessages[selectedChat]
        return newMessages
      })

      // Volver a la lista de chats
      setSelectedChat(null)
      if (isMobile) {
        setShowSidebar(true)
      }
    }
  }

  // Manejar selección de chat de IA
  const handleSelectAIChat = () => {
    setShowAIChat(true)
    setSelectedChat(null)
    if (isMobile) {
      setShowSidebar(false)
    }
  }

  // Manejar regreso desde el chat de IA
  const handleBackFromAIChat = () => {
    setShowAIChat(false)
    if (isMobile) {
      setShowSidebar(true)
    }
  }

  // Ajustar la vista en dispositivos móviles cuando se selecciona un chat
  useEffect(() => {
    if (isMobile && selectedChat) {
      setShowSidebar(false)
    }
  }, [selectedChat, isMobile])

  // Añade esta función después de las otras funciones
  useEffect(() => {
    // Función para verificar si hay cambios en localStorage
    const checkProfileUpdates = () => {
      const storedImage = localStorage.getItem("user-profile-image")
      if (storedImage && storedImage !== profileImage) {
        setProfileImage(storedImage)
      }

      const storedName = localStorage.getItem("user-name")
      if (storedName && storedName !== userName) {
        setUserName(storedName)
      }
    }

    // Verificar cuando la ventana obtiene el foco
    window.addEventListener("focus", checkProfileUpdates)

    // Limpiar el evento
    return () => {
      window.removeEventListener("focus", checkProfileUpdates)
    }
  }, [profileImage, userName])

  return (
    <CallManager userId={userEmail || "guest"}>
      <ChatInterfaceContent
        userEmail={userEmail}
        userName={userName}
        profileImage={profileImage}
        messages={messages}
        setMessages={setMessages}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        showAIChat={showAIChat}
        setShowAIChat={setShowAIChat}
        handleSendMessage={handleSendMessage}
        handleSelectAIChat={handleSelectAIChat}
        handleBackFromAIChat={handleBackFromAIChat}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        isTyping={isTyping}
        showAttachmentMenu={showAttachmentMenu}
        setShowAttachmentMenu={setShowAttachmentMenu}
        showVoiceRecorder={showVoiceRecorder}
        setShowVoiceRecorder={setShowVoiceRecorder}
        showCamera={showCamera}
        setShowCamera={setShowCamera}
        showPollCreator={showPollCreator}
        setShowPollCreator={setShowPollCreator}
        toggleAttachmentMenu={toggleAttachmentMenu}
        toggleVoiceRecorder={toggleVoiceRecorder}
        toggleCamera={toggleCamera}
        togglePollCreator={togglePollCreator}
        handleAttachment={handleAttachment}
        handleVoiceRecording={handleVoiceRecording}
        handleCameraCapture={handleCameraCapture}
        handleCreatePoll={handleCreatePoll}
        handlePollVote={handlePollVote}
        handleMessageRead={handleMessageRead}
        isMobile={isMobile}
        router={router}
        t={t}
        goToProfile={goToProfile}
        goToContacts={goToContacts}
        goToSearch={goToSearch}
        handleLogout={handleLogout}
        message={message}
        setMessage={setMessage}
        handleTyping={handleTyping}
        messageInputRef={messageInputRef}
        handleClearChat={handleClearChat}
        handleBlockUser={handleBlockUser}
        handleReportUser={handleReportUser}
        handleDeleteChat={handleDeleteChat}
        blockedUsers={blockedUsers}
      />
      {showPollCreator && <PollCreator onClose={togglePollCreator} onSubmit={handleCreatePoll} />}
    </CallManager>
  )
}

// Componente interno que recibe todas las props
function ChatInterfaceContent({
  userEmail,
  userName,
  profileImage,
  messages,
  setMessages,
  inputMessage,
  setInputMessage,
  isLoading,
  setIsLoading,
  showSidebar,
  setShowSidebar,
  showAIChat,
  setShowAIChat,
  handleSendMessage,
  handleSelectAIChat,
  handleBackFromAIChat,
  selectedChat,
  setSelectedChat,
  isTyping,
  showAttachmentMenu,
  setShowAttachmentMenu,
  showVoiceRecorder,
  setShowVoiceRecorder,
  showCamera,
  setShowCamera,
  showPollCreator,
  setShowPollCreator,
  toggleAttachmentMenu,
  toggleVoiceRecorder,
  toggleCamera,
  togglePollCreator,
  handleAttachment,
  handleVoiceRecording,
  handleCameraCapture,
  handleCreatePoll,
  handlePollVote,
  handleMessageRead,
  isMobile,
  router,
  t,
  goToProfile,
  goToContacts,
  goToSearch,
  handleLogout,
  message,
  setMessage,
  handleTyping,
  messageInputRef,
  handleClearChat,
  handleBlockUser,
  handleReportUser,
  handleDeleteChat,
  blockedUsers,
}) {
  // Obtener el servicio WebRTC
  const { webRTCService, startCall } = useWebRTC()

  if (!userEmail) {
    return <div className="flex h-screen items-center justify-center">Cargando...</div>
  }

  return (
    <div className="flex flex-col h-screen bg-[#EDEDED]">
      {/* Cámara (cuando está activa) */}
      {showCamera && <CameraCapture onCapture={handleCameraCapture} onCancel={() => setShowCamera(false)} />}

      {/* Vista principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - oculto en móvil cuando se selecciona un chat */}
        {(!isMobile || (isMobile && showSidebar)) && (
          <div
            className={`${isMobile ? "w-full" : "w-full max-w-[360px]"} border-r border-gray-200 bg-white flex flex-col`}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-3 bg-[#07C160] text-white">
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer hover:ring-2 hover:ring-white/50">
                      <AvatarImage src={profileImage || ""} />
                      <AvatarFallback className="bg-[#06A050] text-white">
                        {userName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="font-bold">{userName}</span>
                        <span className="text-xs text-muted-foreground">{userEmail}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={goToProfile} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t("profile")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={goToContacts} className="cursor-pointer">
                      <Users className="mr-2 h-4 w-4" />
                      <span>{t("contacts")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={goToSearch} className="cursor-pointer">
                      <Search className="mr-2 h-4 w-4" />
                      <span>Buscar usuarios</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={goToProfile} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t("settings")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer">
                      <Globe className="mr-2 h-4 w-4" />
                      <span>{t("languageSettings")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t("logout")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="font-medium">{userName}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-white hover:bg-[#06A050]" onClick={goToContacts}>
                  <Users className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-[#06A050]" onClick={goToSearch}>
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-[#06A050]">
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar o iniciar un nuevo chat"
                  className="pl-8 bg-[#F6F6F6] border-none"
                />
              </div>
            </div>

            {/* Conversation List */}
            <ScrollArea className="flex-1">
              <ConversationList
                selectedChat={selectedChat}
                onSelectChat={setSelectedChat}
                onSelectAIChat={handleSelectAIChat}
                messages={messages}
                isAIChatSelected={showAIChat}
                blockedUsers={blockedUsers} // Añadir esta línea
              />
            </ScrollArea>
          </div>
        )}

        {/* Chat Area - visible en móvil solo cuando se selecciona un chat */}
        {(!isMobile || (isMobile && !showSidebar)) && (
          <div className="flex-1 flex flex-col">
            {showAIChat ? (
              <AIChat
                userEmail={userEmail}
                userName={userName}
                profileImage={profileImage}
                onBack={handleBackFromAIChat}
              />
            ) : selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-3 bg-[#07C160] text-white">
                  {isMobile && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-[#06A050] mr-2"
                      onClick={() => setShowSidebar(true)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  )}
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={`https://avatar.vercel.sh/${selectedChat}`} />
                      <AvatarFallback className="bg-[#06A050] text-white">
                        {selectedChat.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedChat.split("@")[0]}</div>
                      <div className="text-xs text-white/80">
                        {blockedUsers.includes(selectedChat)
                          ? "Bloqueado"
                          : isTyping[selectedChat]
                            ? t("typing")
                            : t("online")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-[#06A050]"
                      onClick={() => startCall(selectedChat, "audio")}
                    >
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-[#06A050]"
                      onClick={() => startCall(selectedChat, "video")}
                    >
                      <Video className="h-5 w-5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-[#06A050]">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem className="cursor-pointer">
                          <Users className="mr-2 h-4 w-4" />
                          <span>Ver perfil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Search className="mr-2 h-4 w-4" />
                          <span>Buscar en el chat</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={togglePollCreator}>
                          <BarChart2 className="mr-2 h-4 w-4" />
                          <span>Crear encuesta</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={handleClearChat}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Vaciar chat</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={handleBlockUser}>
                          <Ban className="mr-2 h-4 w-4" />
                          <span>
                            {blockedUsers.includes(selectedChat)
                              ? `Desbloquear a ${selectedChat?.split("@")[0]}`
                              : `Bloquear a ${selectedChat?.split("@")[0]}`}
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-red-500 focus:text-red-500"
                          onClick={handleReportUser}
                        >
                          <Flag className="mr-2 h-4 w-4" />
                          <span>Reportar a {selectedChat?.split("@")[0]}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer text-red-500 focus:text-red-500"
                          onClick={handleDeleteChat}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Eliminar chat</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4 bg-[#E5DDD5]">
                  <MessageList
                    chatId={selectedChat}
                    userEmail={userEmail}
                    profileImage={profileImage || ""}
                    messages={messages[selectedChat] || []}
                    onMessageRead={handleMessageRead}
                    onPollVote={handlePollVote}
                  />
                </ScrollArea>

                {/* Attachment Menu (conditionally rendered) */}
                {showAttachmentMenu && <AttachmentMenu onSelect={handleAttachment} onClose={toggleAttachmentMenu} />}

                {/* Voice Recorder (conditionally rendered) */}
                {showVoiceRecorder ? (
                  <VoiceRecorder onSend={handleVoiceRecording} onCancel={() => setShowVoiceRecorder(false)} />
                ) : (
                  // Reemplazar la sección del Message Input con esta versión:
                  /* Message Input */
                  <div className="p-3 bg-[#F0F0F0] border-t">
                    {blockedUsers.includes(selectedChat) ? (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3 text-center text-sm text-red-600">
                        Has bloqueado a {selectedChat.split("@")[0]}. No puedes enviar mensajes.
                      </div>
                    ) : (
                      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="text-[#07C160] hover:bg-[#07C160]/10"
                          onClick={toggleAttachmentMenu}
                        >
                          <Paperclip className="h-5 w-5" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="text-[#07C160] hover:bg-[#07C160]/10"
                          onClick={toggleCamera}
                        >
                          <Camera className="h-5 w-5" />
                        </Button>
                        <Input
                          ref={messageInputRef}
                          type="text"
                          placeholder={t("writeMessage")}
                          value={message}
                          onChange={(e) => {
                            setMessage(e.target.value)
                            handleTyping()
                          }}
                          className="flex-1 bg-white border-none"
                        />
                        {message.trim() ? (
                          <Button type="submit" size="icon" className="bg-[#07C160] hover:bg-[#06A050] text-white">
                            <Send className="h-5 w-5" />
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            size="icon"
                            className="bg-[#07C160] hover:bg-[#06A050] text-white"
                            onClick={toggleVoiceRecorder}
                          >
                            <Mic className="h-5 w-5" />
                          </Button>
                        )}
                      </form>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-[#F8F9FA] text-center p-4">
                <div className="w-64 h-64 rounded-full bg-[#07C160]/10 flex items-center justify-center mb-6">
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.418 16.97 20 12 20C10.5286 20 9.14629 19.6916 7.94358 19.1412C7.61507 19.0061 7.45082 18.9386 7.32235 18.9308C7.19389 18.9231 7.08893 18.9524 6.87902 19.0111C5.70473 19.3224 4.25291 19.2373 3.42857 18.4129C2.60424 17.5886 2.51913 16.1368 2.83044 14.9625C2.88905 14.7526 2.91835 14.6476 2.91063 14.5192C2.90291 14.3907 2.83541 14.2265 2.7004 13.898C2.14003 12.6953 1.83165 11.3129 1.83165 9.84151C1.83165 5.42348 5.86167 1.84151 10.8317 1.84151C14.7694 1.84151 18.1523 4.10243 19.4922 7.30708C20.4048 9.46892 20.2582 11.9171 19.0844 13.9827"
                      stroke="#07C160"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("welcome")}</h3>
                <p className="text-gray-600 max-w-md">
                  {Object.keys(messages).length === 0
                    ? "No tienes conversaciones activas. Comienza agregando contactos o buscando usuarios."
                    : t("welcomeDesc")}
                </p>
                <div className="flex gap-2 mt-6">
                  <Button className="bg-[#07C160] hover:bg-[#06A050]" onClick={handleSelectAIChat}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chatear con IA
                  </Button>
                  <Button className="bg-[#07C160] hover:bg-[#06A050]" onClick={goToContacts}>
                    <Users className="mr-2 h-4 w-4" />
                    {t("contacts")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navegación inferior para móviles */}
      {isMobile && (
        <div className="flex justify-around items-center bg-white border-t border-gray-200 p-2">
          <Button
            variant="ghost"
            size="icon"
            className={`${showSidebar ? "text-[#07C160]" : "text-gray-500"}`}
            onClick={() => setShowSidebar(true)}
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500" onClick={goToContacts}>
            <Users className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500" onClick={goToSearch}>
            <Search className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500" onClick={goToProfile}>
            <User className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  )
}

