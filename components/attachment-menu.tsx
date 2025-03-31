"use client"

import type React from "react"

import { useState } from "react"
import { Image, File, MapPin, X, Mic, CameraIcon, FileText, Music, Contact } from "lucide-react"
import { useTranslation } from "@/lib/i18n/use-translation"
import { useMobile } from "@/hooks/use-mobile"

interface AttachmentMenuProps {
  onSelect: (type: string, data?: any) => void
  onClose: () => void
}

export default function AttachmentMenu({ onSelect, onClose }: AttachmentMenuProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const isMobile = useMobile()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])

      // Para archivos de audio, crear una URL y enviarla
      if (type === "audio" || type === "music") {
        const audioUrl = URL.createObjectURL(files[0])
        onSelect(type, {
          url: audioUrl,
          name: files[0].name,
          size: files[0].size,
        })
      } else {
        onSelect(type)
      }
    }
  }

  // Reemplazar la función handleLocationSelect con esta versión que no intenta usar geolocalización:
  const handleLocationSelect = () => {
    setLoading(true)

    // Simular un pequeño retraso para dar feedback visual
    setTimeout(() => {
      // Usar coordenadas simuladas en lugar de intentar obtener la ubicación real
      const simulatedLocation = {
        latitude: 19.4326, // Coordenadas simuladas (Ciudad de México)
        longitude: -99.1332,
      }

      // Informar al usuario que se está usando una ubicación simulada
      alert("Para fines de demostración, se enviará una ubicación simulada (Ciudad de México).")

      // Enviar la ubicación simulada
      onSelect("location", simulatedLocation)
      setLoading(false)
    }, 1000)
  }

  const attachmentOptions = [
    {
      id: "document",
      label: t("document"),
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      accept: ".pdf,.doc,.docx,.txt",
    },
    {
      id: "photo",
      label: t("photo"),
      icon: <Image className="h-6 w-6 text-green-500" />,
      accept: "image/*",
    },
    {
      id: "camera",
      label: t("camera"),
      icon: <CameraIcon className="h-6 w-6 text-red-500" />,
      accept: "image/*",
      capture: "environment",
    },
    {
      id: "audio",
      label: t("audio"),
      icon: <Mic className="h-6 w-6 text-orange-500" />,
      accept: "audio/*",
    },
    {
      id: "location",
      label: t("location"),
      icon: <MapPin className="h-6 w-6 text-red-500" />,
      action: handleLocationSelect,
    },
    {
      id: "contact",
      label: t("contact"),
      icon: <Contact className="h-6 w-6 text-purple-500" />,
    },
    {
      id: "file",
      label: t("file"),
      icon: <File className="h-6 w-6 text-blue-700" />,
      accept: "*/*",
    },
    {
      id: "music",
      label: t("music"),
      icon: <Music className="h-6 w-6 text-pink-500" />,
      accept: "audio/*",
    },
  ]

  return (
    <div className="bg-white border-t border-gray-200 p-4 relative">
      <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
        <X className="h-5 w-5" />
      </button>

      <div className="grid grid-cols-4 gap-4 pt-2">
        {attachmentOptions.map((option) => (
          <div key={option.id} className="flex flex-col items-center">
            <label
              htmlFor={`attachment-${option.id}`}
              className={`w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors ${loading && option.id === "location" ? "opacity-50" : ""}`}
              onClick={() => option.action && option.action()}
            >
              {option.icon}
              {option.accept && (
                <input
                  type="file"
                  id={`attachment-${option.id}`}
                  className="hidden"
                  accept={option.accept}
                  capture={option.capture}
                  onChange={(e) => handleFileChange(e, option.id)}
                />
              )}
            </label>
            <span className="text-xs mt-1 text-center">
              {loading && option.id === "location" ? "Obteniendo..." : option.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

