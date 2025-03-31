"use client"

import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, FileText, Check, CheckCheck, Play, Pause, BarChart2 } from "lucide-react"
import { useTranslation } from "@/lib/i18n/use-translation"
import { Button } from "@/components/ui/button"

export interface PollOption {
  id: string
  text: string
  votes?: number
  voters?: string[]
}

export interface PollData {
  question: string
  options: PollOption[]
  totalVotes?: number
  userVote?: string
}

export interface Message {
  id: string
  sender: string
  text: string
  timestamp: string
  type?: "text" | "image" | "location" | "file" | "audio" | "poll"
  fileUrl?: string
  fileName?: string
  status?: "sent" | "delivered" | "read"
  isNew?: boolean
  locationData?: {
    latitude: number
    longitude: number
  }
  audioData?: {
    url: string
    name: string
    size: number
  }
  pollData?: PollData
}

interface MessageListProps {
  chatId: string
  userEmail: string
  profileImage: string
  messages: Message[]
  onMessageRead: (messageId: string) => void
  onPollVote?: (messageId: string, optionId: string) => void
}

export default function MessageList({
  chatId,
  userEmail,
  profileImage,
  messages,
  onMessageRead,
  onPollVote,
}: MessageListProps) {
  const { t } = useTranslation()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({})

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

    // Mark new messages as read
    messages.forEach((message) => {
      if (message.isNew && message.sender !== userEmail) {
        onMessageRead(message.id)
      }
    })
  }, [messages, onMessageRead, userEmail])

  const handlePlayAudio = (messageId: string) => {
    const audioElement = audioRefs.current[messageId]

    if (!audioElement) return

    if (playingAudio === messageId) {
      // Si ya está reproduciendo este audio, pausarlo
      audioElement.pause()
      setPlayingAudio(null)
    } else {
      // Si hay otro audio reproduciéndose, pausarlo
      if (playingAudio && audioRefs.current[playingAudio]) {
        audioRefs.current[playingAudio]?.pause()
      }

      // Reproducir el nuevo audio
      audioElement.play()
      setPlayingAudio(messageId)

      // Cuando termine, actualizar el estado
      audioElement.onended = () => {
        setPlayingAudio(null)
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const handleVoteOnPoll = (messageId: string, optionId: string) => {
    if (onPollVote) {
      onPollVote(messageId, optionId)
    }
  }

  const renderPoll = (message: Message) => {
    if (!message.pollData) return null

    const { question, options, totalVotes = 0, userVote } = message.pollData
    const hasVoted = !!userVote

    return (
      <div className="flex flex-col w-full">
        <div className="flex items-center mb-2">
          <BarChart2 className="h-5 w-5 mr-1" />
          <span className="font-medium">Encuesta</span>
        </div>
        <div className="font-medium mb-2">{question}</div>
        <div className="space-y-2 w-full">
          {options.map((option) => {
            const votePercentage = totalVotes > 0 ? Math.round(((option.votes || 0) / totalVotes) * 100) : 0
            const isSelected = userVote === option.id

            return (
              <div key={option.id} className="w-full">
                {hasVoted ? (
                  <div className="relative w-full">
                    <div
                      className={`p-2 rounded-md w-full flex justify-between items-center ${
                        isSelected ? "bg-[#07C160]/20 border border-[#07C160]" : "bg-gray-100"
                      }`}
                    >
                      <span>{option.text}</span>
                      <span className="text-sm font-medium">{votePercentage}%</span>
                    </div>
                    <div
                      className={`absolute top-0 left-0 h-full rounded-md ${
                        isSelected ? "bg-[#07C160]/10" : "bg-gray-200/50"
                      }`}
                      style={{ width: `${votePercentage}%`, maxWidth: "100%" }}
                    />
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-[#07C160]/10 hover:border-[#07C160]"
                    onClick={() => handleVoteOnPoll(message.id, option.id)}
                  >
                    {option.text}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {totalVotes} {totalVotes === 1 ? "voto" : "votos"}
        </div>
      </div>
    )
  }

  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case "image":
        return (
          <div className="rounded-lg overflow-hidden">
            <img src={message.fileUrl || "/placeholder.svg"} alt="Imagen compartida" className="max-w-full h-auto" />
          </div>
        )
      case "location":
        return (
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <MapPin className="h-5 w-5 mr-1" />
              <span>{t("location")}</span>
            </div>
            {message.locationData ? (
              <a
                href={`https://www.google.com/maps?q=${message.locationData.latitude},${message.locationData.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="relative">
                  <img
                    src={`https://picsum.photos/seed/map${message.id}/300/150`}
                    alt="Ubicación compartida"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-red-500 drop-shadow-md" />
                  </div>
                </div>
                <div className="text-xs mt-1 text-center">
                  {message.locationData.latitude.toFixed(6)}, {message.locationData.longitude.toFixed(6)}
                </div>
              </a>
            ) : (
              <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center">
                <img
                  src="https://picsum.photos/seed/map/300/150"
                  alt="Mapa"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        )
      case "audio":
        return (
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => message.audioData?.url && handlePlayAudio(message.id)}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2"
                >
                  {playingAudio === message.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <div>
                  <div className="text-sm font-medium truncate max-w-[150px]">{message.audioData?.name || "Audio"}</div>
                  <div className="text-xs text-gray-500">
                    {message.audioData?.size ? formatFileSize(message.audioData.size) : ""}
                  </div>
                </div>
              </div>
            </div>
            {message.audioData?.url && (
              <audio
                ref={(el) => (audioRefs.current[message.id] = el)}
                src={message.audioData.url}
                className="hidden"
              />
            )}
          </div>
        )
      case "file":
        return (
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            <span>{message.fileName}</span>
          </div>
        )
      case "poll":
        return renderPoll(message)
      default:
        return message.text
    }
  }

  const renderMessageStatus = (message: Message) => {
    if (message.sender !== userEmail) return null

    switch (message.status) {
      case "sent":
        return <Check className="h-3.5 w-3.5 text-gray-400" />
      case "delivered":
        return <Check className="h-3.5 w-3.5 text-gray-400" />
      case "read":
        return <CheckCheck className="h-3.5 w-3.5 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isUser = message.sender === userEmail

        return (
          <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-2 max-w-[70%] ${isUser ? "flex-row-reverse" : ""}`}>
              {!isUser ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://avatar.vercel.sh/${message.sender}`} />
                  <AvatarFallback className="bg-[#07C160] text-white">
                    {message.sender.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profileImage} />
                  <AvatarFallback className="bg-[#07C160] text-white">
                    {userEmail.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <div className={`rounded-lg p-3 ${isUser ? "bg-[#07C160] text-white" : "bg-white text-gray-800"}`}>
                  {renderMessageContent(message)}
                </div>
                <div
                  className={`text-xs text-gray-500 mt-1 ${isUser ? "text-right flex items-center justify-end gap-1" : ""}`}
                >
                  {message.timestamp}
                  {renderMessageStatus(message)}
                </div>
              </div>
            </div>
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}

