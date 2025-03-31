"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Message } from "./message-list"
import { useTranslation } from "@/lib/i18n/use-translation"
import { aiPersonalities } from "@/lib/ai-service"

interface ConversationListProps {
  selectedChat: string | null
  onSelectChat: (chatId: string) => void
  onSelectAIChat: () => void
  messages: Record<string, Message[]>
  isAIChatSelected: boolean
  blockedUsers?: string[]
}

// Mock data for conversations - solo visible en desarrollo
const isDevelopmentMode = true // Cambiar a false cuando se despliegue la app

const conversations = isDevelopmentMode
  ? [
      {
        id: "juan@example.com",
        name: "Juan Pérez",
        time: "10:30",
      },
      {
        id: "maria@example.com",
        name: "María García",
        time: "09:15",
      },
      {
        id: "carlos@example.com",
        name: "Carlos Rodríguez",
        time: "Ayer",
      },
      {
        id: "ana@example.com",
        name: "Ana Martínez",
        time: "Ayer",
      },
      {
        id: "pedro@example.com",
        name: "Pedro López",
        time: "Lunes",
      },
    ]
  : [] // Array vacío en producción

export default function ConversationList({
  selectedChat,
  onSelectChat,
  onSelectAIChat,
  messages,
  isAIChatSelected,
  blockedUsers = [],
}: ConversationListProps) {
  const { t } = useTranslation()

  // Get the last message for each conversation
  const getLastMessage = (chatId: string) => {
    const chatMessages = messages[chatId] || []
    return chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null
  }

  // Count unread messages
  const countUnreadMessages = (chatId: string) => {
    const chatMessages = messages[chatId] || []
    return chatMessages.filter((msg) => msg.isNew && msg.sender === chatId).length
  }

  return (
    <div className="divide-y">
      {/* AI Assistant Chat - siempre visible */}
      <div
        className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 ${
          isAIChatSelected ? "bg-[#E9FFEF]" : ""
        }`}
        onClick={onSelectAIChat}
      >
        <Avatar>
          <AvatarImage src={aiPersonalities.assistant.avatar} />
          <AvatarFallback className="bg-[#07C160] text-white">AI</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <div className="font-medium truncate">Asistente IA</div>
            <div className="text-xs text-gray-500">Ahora</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 truncate">Inteligencia artificial avanzada</div>
          </div>
        </div>
      </div>

      {/* Regular conversations */}
      {conversations.map((conversation) => {
        const lastMessage = getLastMessage(conversation.id)
        const unreadCount = countUnreadMessages(conversation.id)
        const chatId = conversation.id

        return (
          <div
            key={conversation.id}
            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 ${
              selectedChat === conversation.id ? "bg-[#E9FFEF]" : ""
            }`}
            onClick={() => onSelectChat(conversation.id)}
          >
            <Avatar>
              <AvatarImage src={`https://avatar.vercel.sh/${conversation.id}`} />
              <AvatarFallback className="bg-[#07C160] text-white">{conversation.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <div className="font-medium truncate">{conversation.name}</div>
                <div className="text-xs text-gray-500">{lastMessage ? lastMessage.timestamp : conversation.time}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500 truncate">
                  {lastMessage
                    ? lastMessage.type === "text"
                      ? lastMessage.text
                      : `${lastMessage.type === "image" ? "📷" : lastMessage.type === "location" ? "📍" : "📎"} ${t(lastMessage.type || "file")}`
                    : ""}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <span>{lastMessage?.timestamp || "Sin mensajes"}</span>
                  {blockedUsers.includes(chatId) && (
                    <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px] font-medium">
                      Bloqueado
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#07C160] text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

