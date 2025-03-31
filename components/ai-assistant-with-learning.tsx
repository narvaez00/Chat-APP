"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  MessageSquare,
  Brain,
  Database,
  Settings,
  Send,
  ThumbsUp,
  ThumbsDown,
  Save,
  BarChart,
  Tag,
  Lightbulb,
} from "lucide-react"

import { AIAssistantWithLearning, type ChatMessage } from "../lib/memory-service"
import { LearningInterface } from "../lib/learning-interface"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: number
}

export default function AIAssistantWithLearningUI() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [assistant, setAssistant] = useState<AIAssistantWithLearning | null>(null)
  const [activeTab, setActiveTab] = useState("chat")
  const [userFeedback, setUserFeedback] = useState<{
    [messageId: string]: { helpful: boolean; relevant: boolean; sentiment: number }
  }>({})
  const [learningEnabled, setLearningEnabled] = useState(true)
  const [classificationEnabled, setClassificationEnabled] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Inicializar asistente al cargar
  useEffect(() => {
    // Usar un ID de usuario fijo para demo
    // En una aplicación real, se usaría el ID del usuario autenticado
    const userId = "demo-user"

    const newAssistant = new AIAssistantWithLearning(userId)
    setAssistant(newAssistant)

    // Añadir mensaje de bienvenida
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hola, soy tu asistente con capacidad de aprendizaje. Puedo recordar información, clasificar textos y hacer predicciones. ¿En qué puedo ayudarte hoy?",
        timestamp: Date.now(),
      },
    ])
  }, [])

  // Scroll al final de los mensajes cuando se añade uno nuevo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Enviar mensaje
  const handleSendMessage = async () => {
    if (!input.trim() || !assistant) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    try {
      // Convertir mensajes al formato esperado por el asistente
      const chatHistory: ChatMessage[] = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      // Añadir el mensaje actual
      chatHistory.push({
        role: userMessage.role,
        content: userMessage.content,
      })

      // Procesar mensaje con el asistente
      const response = await assistant.processMessage(input, chatHistory)

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error al procesar mensaje:", error)

      // Añadir mensaje de error
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, inténtalo de nuevo.",
          timestamp: Date.now(),
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  // Manejar tecla Enter para enviar mensaje
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Dar feedback a un mensaje del asistente
  const handleFeedback = (messageId: string, type: "helpful" | "unhelpful" | "relevant" | "irrelevant") => {
    if (!assistant) return

    setUserFeedback((prev) => {
      const messageFeedback = prev[messageId] || { helpful: false, relevant: false, sentiment: 0 }

      if (type === "helpful") {
        messageFeedback.helpful = true
        messageFeedback.sentiment = 0.5
      } else if (type === "unhelpful") {
        messageFeedback.helpful = false
        messageFeedback.sentiment = -0.5
      } else if (type === "relevant") {
        messageFeedback.relevant = true
        messageFeedback.sentiment += 0.2
      } else if (type === "irrelevant") {
        messageFeedback.relevant = false
        messageFeedback.sentiment -= 0.2
      }

      // Limitar sentimiento al rango [-1, 1]
      messageFeedback.sentiment = Math.max(-1, Math.min(1, messageFeedback.sentiment))

      return {
        ...prev,
        [messageId]: messageFeedback,
      }
    })

    // Buscar el mensaje
    const message = messages.find((msg) => msg.id === messageId)
    if (message && message.role === "assistant") {
      // Procesar feedback para aprendizaje
      assistant.learningManager.processAssistantResponse(message.content, {
        helpful: type === "helpful",
        relevant: type === "relevant",
        sentiment: type === "helpful" ? 0.5 : type === "unhelpful" ? -0.5 : 0,
      })
    }
  }

  // Guardar conversación actual
  const handleSaveConversation = () => {
    if (!assistant) return

    // Extraer palabras clave de la conversación
    const conversationText = messages.map((msg) => msg.content).join(" ")
    const extractedInfo = assistant.memoryManager.extractInformation(conversationText)

    // Finalizar sesión y crear resumen
    assistant.endSession(
      extractedInfo.keywords,
      extractedInfo.sentiment,
      8, // Rendimiento del asistente (valor arbitrario para demo)
      [], // Elementos de acción
      false, // No se necesita seguimiento
    )

    alert("Conversación guardada correctamente")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Asistente IA con Aprendizaje</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Chat</span>
          </TabsTrigger>
          <TabsTrigger value="learning" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span>Aprendizaje</span>
          </TabsTrigger>
          <TabsTrigger value="memory" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Memoria</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Configuración</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversación</CardTitle>
              <CardDescription>Conversa con el asistente y observa cómo aprende de tus interacciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] overflow-y-auto border rounded-md p-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 ${
                      message.role === "assistant"
                        ? "bg-blue-50 p-3 rounded-lg"
                        : "bg-gray-100 p-3 rounded-lg ml-auto max-w-[80%]"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium">{message.role === "assistant" ? "Asistente" : "Tú"}</div>
                      <div className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleTimeString()}</div>
                    </div>
                    <div className="mt-1">{message.content}</div>

                    {message.role === "assistant" && (
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => handleFeedback(message.id, "helpful")}
                          className={`p-1 rounded-full ${
                            userFeedback[message.id]?.helpful
                              ? "bg-green-100 text-green-600"
                              : "text-gray-400 hover:text-green-600"
                          }`}
                          title="Útil"
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleFeedback(message.id, "unhelpful")}
                          className={`p-1 rounded-full ${
                            userFeedback[message.id]?.helpful === false
                              ? "bg-red-100 text-red-600"
                              : "text-gray-400 hover:text-red-600"
                          }`}
                          title="No útil"
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleFeedback(message.id, "relevant")}
                          className={`p-1 rounded-full ${
                            userFeedback[message.id]?.relevant
                              ? "bg-blue-100 text-blue-600"
                              : "text-gray-400 hover:text-blue-600"
                          }`}
                          title="Relevante"
                        >
                          <Tag className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe un mensaje..."
                  className="flex-1"
                  disabled={isProcessing}
                />
                <Button onClick={handleSendMessage} disabled={!input.trim() || isProcessing} className="self-end">
                  {isProcessing ? "Procesando..." : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <Switch id="learning-mode" checked={learningEnabled} onCheckedChange={setLearningEnabled} />
                <Label htmlFor="learning-mode">Modo Aprendizaje</Label>
              </div>
              <Button variant="outline" onClick={handleSaveConversation} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>Guardar Conversación</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Aprendizaje y Clasificación</CardTitle>
              <CardDescription>Crea y entrena modelos de clasificación y predicción</CardDescription>
            </CardHeader>
            <CardContent>{assistant && <LearningInterface />}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memory" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Memoria y Análisis</CardTitle>
              <CardDescription>Explora la información almacenada y los análisis generados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Información Almacenada</h3>

                  <div className="border rounded-md p-4 h-[300px] overflow-y-auto">
                    {assistant ? (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Perfil de Usuario</h4>
                          <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                            {JSON.stringify(assistant.getUserProfile(), null, 2)}
                          </pre>
                        </div>

                        <div>
                          <h4 className="font-medium">Memorias Recientes</h4>
                          <div className="space-y-2 mt-2">
                            {assistant.searchMemories("", { limit: 5, sortBy: "timestamp" }).map((memory) => (
                              <div key={memory.id} className="bg-gray-100 p-2 rounded text-sm">
                                <div className="font-medium">{memory.category}</div>
                                <div className="text-xs text-gray-500">
                                  {new Date(memory.timestamp).toLocaleString()}
                                </div>
                                <div className="mt-1">{memory.content}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Cargando...</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Análisis y Estadísticas</h3>

                  <div className="border rounded-md p-4 h-[300px] overflow-y-auto">
                    {assistant ? (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Recomendaciones</h4>
                          <div className="space-y-2 mt-2">
                            {assistant.getRecommendations().topicSuggestions.map((topic, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Lightbulb className="h-4 w-4 text-yellow-500" />
                                <span>{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">Datos Compilados</h4>
                          <div className="mt-2">
                            <BarChart className="h-6 w-6 text-blue-500 mb-2" />
                            <p className="text-sm text-gray-500">
                              Usa la pestaña de Aprendizaje para compilar y analizar datos de conversaciones.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Cargando...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
              <CardDescription>Personaliza el comportamiento del asistente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Aprendizaje</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="learning-enabled">Habilitar Aprendizaje</Label>
                      <p className="text-sm text-gray-500">Permite que el asistente aprenda de las conversaciones</p>
                    </div>
                    <Switch id="learning-enabled" checked={learningEnabled} onCheckedChange={setLearningEnabled} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Clasificación</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="classification-enabled">Habilitar Clasificación</Label>
                      <p className="text-sm text-gray-500">
                        Permite que el asistente clasifique textos automáticamente
                      </p>
                    </div>
                    <Switch
                      id="classification-enabled"
                      checked={classificationEnabled}
                      onCheckedChange={setClassificationEnabled}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Personalidad</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <h4 className="font-medium">Asistente</h4>
                      <p className="text-sm text-gray-500">Formal, informativo y profesional</p>
                    </div>
                    <div className="border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <h4 className="font-medium">Amigo</h4>
                      <p className="text-sm text-gray-500">Casual, cercano y conversacional</p>
                    </div>
                    <div className="border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <h4 className="font-medium">Terapeuta</h4>
                      <p className="text-sm text-gray-500">Empático, reflexivo y comprensivo</p>
                    </div>
                    <div className="border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <h4 className="font-medium">Mentor</h4>
                      <p className="text-sm text-gray-500">Orientador, sabio y motivador</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Memoria</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="memory-retention">Retención de Memoria</Label>
                      <Input id="memory-retention" type="range" min="1" max="10" defaultValue="7" className="w-full" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Corto plazo</span>
                        <span>Largo plazo</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      Limpiar Memoria
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

