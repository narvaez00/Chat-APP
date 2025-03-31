"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, ArrowLeft, Settings, Loader2 } from "lucide-react"
import { generateAIResponse, type ChatMessage, aiPersonalities } from "@/lib/ai-service"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface AIMessage {
  id: string
  sender: "user" | "ai"
  text: string
  timestamp: string
  isStreaming?: boolean
}

interface AIChatProps {
  userEmail: string
  userName: string | null
  profileImage: string | null
  onBack: () => void
}

export default function AIChat({ userEmail, userName, profileImage, onBack }: AIChatProps) {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [personality, setPersonality] = useState<keyof typeof aiPersonalities>("assistant")
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)

  // Generar un ID único para los mensajes
  const generateId = () => Math.random().toString(36).substring(2, 15)

  // Obtener la hora actual formateada
  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Cargar mensajes guardados al iniciar
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(`ai-chat-messages-${userEmail}`)
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages))
      } else {
        // Mensaje de bienvenida si no hay mensajes guardados
        const welcomeMessage: AIMessage = {
          id: generateId(),
          sender: "ai",
          text: `Hola ${userName || "usuario"}, soy tu asistente de IA. Estoy aquí para conversar contigo sobre cualquier tema que te interese. Puedes preguntarme lo que quieras o simplemente charlar. ¿En qué puedo ayudarte hoy?`,
          timestamp: getCurrentTime(),
        }
        setMessages([welcomeMessage])
      }

      // Cargar personalidad guardada
      const savedPersonality = localStorage.getItem(`ai-personality-${userEmail}`)
      if (savedPersonality && Object.keys(aiPersonalities).includes(savedPersonality)) {
        setPersonality(savedPersonality as keyof typeof aiPersonalities)
      }

      // Cargar historial de chat
      const savedHistory = localStorage.getItem(`ai-chat-history-${userEmail}`)
      if (savedHistory) {
        setChatHistory(JSON.parse(savedHistory))
      } else {
        // Inicializar con el mensaje del sistema
        setChatHistory([
          {
            role: "system",
            content: aiPersonalities.assistant.systemPrompt,
          },
        ])
      }
    } catch (error) {
      console.error("Error al cargar datos:", error)
      // Mensaje de bienvenida como fallback
      const welcomeMessage: AIMessage = {
        id: generateId(),
        sender: "ai",
        text: `Hola ${userName || "usuario"}, soy tu asistente de IA. Estoy aquí para conversar contigo sobre cualquier tema que te interese. ¿En qué puedo ayudarte hoy?`,
        timestamp: getCurrentTime(),
      }
      setMessages([welcomeMessage])
    }
  }, [userEmail, userName])

  // Guardar mensajes cuando cambien
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(`ai-chat-messages-${userEmail}`, JSON.stringify(messages))
      } catch (error) {
        console.error("Error al guardar mensajes:", error)
      }
    }
  }, [messages, userEmail])

  // Guardar historial cuando cambie
  useEffect(() => {
    if (chatHistory.length > 0) {
      try {
        localStorage.setItem(`ai-chat-history-${userEmail}`, JSON.stringify(chatHistory))
      } catch (error) {
        console.error("Error al guardar historial:", error)
      }
    }
  }, [chatHistory, userEmail])

  // Guardar personalidad cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem(`ai-personality-${userEmail}`, personality)

      // Actualizar el mensaje del sistema en el historial
      setChatHistory((prev) => {
        const newHistory = [...prev]
        // Reemplazar o agregar el mensaje del sistema
        if (newHistory[0]?.role === "system") {
          newHistory[0].content = aiPersonalities[personality].systemPrompt
        } else {
          newHistory.unshift({
            role: "system",
            content: aiPersonalities[personality].systemPrompt,
          })
        }
        return newHistory
      })
    } catch (error) {
      console.error("Error al guardar personalidad:", error)
    }
  }, [personality, userEmail])

  // Scroll al final cuando se añaden mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Manejar cambio de personalidad
  const handlePersonalityChange = (value: string) => {
    setPersonality(value as keyof typeof aiPersonalities)
  }

  // Manejar envío de mensaje
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    // Limpiar error previo si existe

    // Crear nuevo mensaje del usuario
    const userMessage: AIMessage = {
      id: generateId(),
      sender: "user",
      text: inputMessage,
      timestamp: getCurrentTime(),
    }

    // Añadir mensaje a la interfaz
    setMessages((prev) => [...prev, userMessage])

    // Crear mensaje placeholder para la respuesta de la IA
    const aiMessageId = generateId()
    const aiMessage: AIMessage = {
      id: aiMessageId,
      sender: "ai",
      text: "",
      timestamp: getCurrentTime(),
      isStreaming: true,
    }

    // Añadir mensaje placeholder
    setMessages((prev) => [...prev, aiMessage])
    setStreamingMessageId(aiMessageId)

    // Actualizar historial de chat
    const updatedHistory = [...chatHistory, { role: "user", content: inputMessage }]
    setChatHistory(updatedHistory)

    // Limpiar input
    setInputMessage("")
    setIsLoading(true)

    try {
      // Generar respuesta de la IA con streaming
      let fullResponse = ""

      await generateAIResponse(updatedHistory, (chunk) => {
        fullResponse += chunk
        // Actualizar el mensaje de la IA con el texto recibido hasta ahora
        setMessages((prev) => prev.map((msg) => (msg.id === aiMessageId ? { ...msg, text: fullResponse } : msg)))
      })

      // Finalizar streaming
      setStreamingMessageId(null)

      // Añadir respuesta al historial
      setChatHistory((prev) => [...prev, { role: "assistant", content: fullResponse }])
    } catch (error) {
      console.error("Error en la conversación con IA:", error)

      // Actualizar el mensaje con una respuesta de error amigable
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                text: "Lo siento, tuve un problema al procesar tu mensaje. ¿Podrías intentarlo de nuevo?",
                isStreaming: false,
              }
            : msg,
        ),
      )
    } finally {
      setIsLoading(false)
      setStreamingMessageId(null)
    }
  }

  // Limpiar historial de chat
  const handleClearChat = () => {
    // Mantener solo el mensaje del sistema
    const systemMessage = chatHistory.find((msg) => msg.role === "system")
    setChatHistory(systemMessage ? [systemMessage] : [])

    // Añadir mensaje de bienvenida
    const welcomeMessage: AIMessage = {
      id: generateId(),
      sender: "ai",
      text: `Hola ${userName || "usuario"}, soy tu asistente de IA. ¿En qué puedo ayudarte hoy?`,
      timestamp: getCurrentTime(),
    }
    setMessages([welcomeMessage])
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-[#07C160] text-white">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-[#06A050]" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={aiPersonalities[personality].avatar} />
              <AvatarFallback className="bg-[#06A050] text-white">AI</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{aiPersonalities[personality].name}</div>
              <div className="text-xs text-white/80">{isLoading ? "Escribiendo..." : "Asistente IA"}</div>
            </div>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-[#06A050]">
              <Settings className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configuración del Asistente</DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <h4 className="mb-3 font-medium">Personalidad del Asistente</h4>
              <RadioGroup value={personality} onValueChange={handlePersonalityChange} className="space-y-2">
                {Object.entries(aiPersonalities).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-100">
                    <RadioGroupItem value={key} id={`personality-${key}`} />
                    <Label htmlFor={`personality-${key}`} className="flex-1 cursor-pointer">
                      <div className="font-medium">{value.name}</div>
                      <div className="text-sm text-gray-500">{value.systemPrompt.substring(0, 60)}...</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClearChat} className="mr-auto">
                Limpiar conversación
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-[#E5DDD5]">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-2 max-w-[70%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                {message.sender === "ai" ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={aiPersonalities[personality].avatar} />
                    <AvatarFallback className="bg-[#07C160] text-white">AI</AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profileImage || ""} />
                    <AvatarFallback className="bg-[#07C160] text-white">
                      {userName?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === "user" ? "bg-[#07C160] text-white" : "bg-white text-gray-800"
                    }`}
                  >
                    {message.text || (message.isStreaming ? "..." : "")}
                    {message.isStreaming && streamingMessageId === message.id && (
                      <span className="inline-block w-1.5 h-4 ml-1 bg-gray-500 animate-pulse"></span>
                    )}
                  </div>
                  <div className={`text-xs text-gray-500 mt-1 ${message.sender === "user" ? "text-right" : ""}`}>
                    {message.timestamp}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 bg-[#F0F0F0] border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Escribe un mensaje..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-white border-none"
          />
          <Button
            type="submit"
            size="icon"
            className="bg-[#07C160] hover:bg-[#06A050] text-white"
            disabled={isLoading || !inputMessage.trim()}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  )
}

