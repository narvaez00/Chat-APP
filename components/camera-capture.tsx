"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, X, RotateCw, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CameraCaptureProps {
  onCapture: (imageBlob: Blob) => void
  onCancel: () => void
}

export default function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Iniciar la cámara
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        })
        setStream(mediaStream)

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (error) {
        console.error("Error al acceder a la cámara:", error)
        alert("No se pudo acceder a la cámara. Por favor, verifica los permisos.")
        onCancel()
      }
    }

    startCamera()

    // Limpiar al desmontar
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [facingMode, onCancel])

  // Cambiar entre cámara frontal y trasera
  const toggleCamera = () => {
    // Detener el stream actual
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }

    // Cambiar el modo
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
    setCapturedImage(null)
  }

  // Tomar foto
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      // Configurar el canvas con las dimensiones del video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Dibujar el frame actual del video en el canvas
      const context = canvas.getContext("2d")
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convertir a imagen
        const imageDataUrl = canvas.toDataURL("image/jpeg")
        setCapturedImage(imageDataUrl)

        // Detener la cámara después de capturar
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
          setStream(null)
        }
      }
    }
  }

  // Enviar la imagen capturada
  const sendImage = () => {
    if (capturedImage && canvasRef.current) {
      canvasRef.current.toBlob(
        (blob) => {
          if (blob) {
            onCapture(blob)
          }
        },
        "image/jpeg",
        0.8,
      )
    }
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 text-white">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onCancel}>
          <X className="h-6 w-6" />
        </Button>

        {!capturedImage && (
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={toggleCamera}>
            <RotateCw className="h-6 w-6" />
          </Button>
        )}
      </div>

      <div className="flex-1 relative">
        {!capturedImage ? (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        ) : (
          <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full h-full object-cover" />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="p-4 flex justify-center items-center bg-black">
        {!capturedImage ? (
          <Button
            variant="outline"
            size="icon"
            className="w-16 h-16 rounded-full border-4 border-white text-white hover:bg-white/20"
            onClick={takePhoto}
          >
            <Camera className="h-8 w-8" />
          </Button>
        ) : (
          <div className="flex gap-8">
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full border-2 border-white text-white hover:bg-white/20"
              onClick={() => {
                setCapturedImage(null)
                // Reiniciar la cámara
                const startCamera = async () => {
                  try {
                    const mediaStream = await navigator.mediaDevices.getUserMedia({
                      video: { facingMode },
                    })
                    setStream(mediaStream)

                    if (videoRef.current) {
                      videoRef.current.srcObject = mediaStream
                    }
                  } catch (error) {
                    console.error("Error al reiniciar la cámara:", error)
                  }
                }
                startCamera()
              }}
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full border-2 border-[#07C160] text-[#07C160] hover:bg-[#07C160]/20"
              onClick={sendImage}
            >
              <Send className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

