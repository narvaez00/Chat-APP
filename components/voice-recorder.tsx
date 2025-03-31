"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, Square, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob) => void
  onCancel: () => void
}

export default function VoiceRecorder({ onSend, onCancel }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Iniciar grabación
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        setAudioBlob(audioBlob)

        // Detener todos los tracks del stream
        stream.getTracks().forEach((track) => track.stop())
      }

      // Iniciar grabación
      mediaRecorder.start()
      setIsRecording(true)

      // Iniciar temporizador
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error al acceder al micrófono:", error)
      alert("No se pudo acceder al micrófono. Por favor, verifica los permisos.")
    }
  }

  // Detener grabación
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Detener temporizador
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  // Enviar audio grabado
  const handleSend = () => {
    if (audioBlob) {
      onSend(audioBlob)
    }
  }

  // Cancelar grabación
  const handleCancel = () => {
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    onCancel()
  }

  // Formatear tiempo de grabación
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
      }
    }
  }, [isRecording])

  return (
    <div className="p-3 bg-[#F0F0F0] border-t flex items-center gap-2">
      <div className="flex-1 bg-white rounded-full p-2 flex items-center justify-between">
        {!isRecording && !audioBlob ? (
          <div className="flex items-center justify-between w-full px-2">
            <span className="text-gray-500">Presiona para grabar</span>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="text-[#07C160] hover:bg-[#07C160]/10"
              onClick={startRecording}
            >
              <Mic className="h-5 w-5" />
            </Button>
          </div>
        ) : isRecording ? (
          <div className="flex items-center justify-between w-full px-2">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-red-500 mr-2 animate-pulse"></div>
              <span className="text-red-500 font-medium">{formatTime(recordingTime)}</span>
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="text-red-500 hover:bg-red-100"
              onClick={stopRecording}
            >
              <Square className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full px-2">
            <span className="text-gray-700">Audio grabado</span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="text-[#07C160] hover:bg-[#07C160]/10"
                onClick={handleSend}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="text-gray-500 hover:bg-gray-200"
        onClick={handleCancel}
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  )
}

