"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface PollOption {
  id: string
  text: string
}

export interface PollData {
  question: string
  options: PollOption[]
}

interface PollCreatorProps {
  onClose: () => void
  onSubmit: (pollData: PollData) => void
}

export default function PollCreator({ onClose, onSubmit }: PollCreatorProps) {
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState<PollOption[]>([
    { id: "1", text: "" },
    { id: "2", text: "" },
  ])

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, { id: Date.now().toString(), text: "" }])
    }
  }

  const handleRemoveOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter((option) => option.id !== id))
    }
  }

  const handleOptionChange = (id: string, text: string) => {
    setOptions(options.map((option) => (option.id === id ? { ...option, text } : option)))
  }

  const handleSubmit = () => {
    // Validar que haya una pregunta y al menos dos opciones con texto
    if (!question.trim()) {
      alert("Por favor, ingresa una pregunta para la encuesta")
      return
    }

    const filledOptions = options.filter((option) => option.text.trim())
    if (filledOptions.length < 2) {
      alert("Por favor, ingresa al menos dos opciones para la encuesta")
      return
    }

    onSubmit({
      question,
      options: filledOptions,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
        <div className="p-4 border-b flex justify-between items-center bg-[#07C160] text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">Crear encuesta</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-[#06A050]">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <Label htmlFor="question" className="block mb-2">
              Pregunta
            </Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Escribe tu pregunta aquí"
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <Label className="block mb-2">Opciones</Label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    placeholder={`Opción ${index + 1}`}
                    className="flex-1"
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(option.id)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 10 && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleAddOption}
                className="mt-2 text-[#07C160] hover:bg-[#07C160]/10 w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Añadir opción
              </Button>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button className="bg-[#07C160] hover:bg-[#06A050]" onClick={handleSubmit}>
              Crear encuesta
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

