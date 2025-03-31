"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react"
import { useTranslation } from "@/lib/i18n/use-translation"
import { recoverAccount } from "@/lib/auth-service"

export default function RecoverForm() {
  const [email, setEmail] = useState("")
  const [step, setStep] = useState<"email" | "security" | "reset" | "success">("email")
  const [securityAnswer, setSecurityAnswer] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [userData, setUserData] = useState<any>(null)
  const router = useRouter()
  const { t } = useTranslation()

  // Preguntas de seguridad simuladas
  const securityQuestions = [
    "¿Cuál es el nombre de tu primera mascota?",
    "¿En qué ciudad naciste?",
    "¿Cuál es el nombre de tu escuela primaria?",
    "¿Cuál es tu color favorito?",
    "¿Cuál es el segundo nombre de tu madre?",
  ]

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validar email
    if (!email.trim()) {
      setError("Por favor, ingresa tu correo electrónico")
      setLoading(false)
      return
    }

    // Intentar recuperar la cuenta
    const result = recoverAccount(email)

    if (result.success) {
      setUserData(result.userData)
      // Avanzar al siguiente paso
      setStep("security")
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  const handleSubmitSecurity = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulamos verificación de respuesta de seguridad
    // En una aplicación real, esto se verificaría en el servidor
    setTimeout(() => {
      // Para fines de demostración, cualquier respuesta es válida
      setStep("reset")
      setLoading(false)
    }, 1000)
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validar contraseñas
    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    // Actualizar contraseña
    const result = recoverAccount(email, newPassword)

    if (result.success) {
      setStep("success")
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  const getRandomSecurityQuestion = () => {
    // Generar un índice aleatorio basado en el email para siempre obtener la misma pregunta para el mismo usuario
    const emailHash = email.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const index = emailHash % securityQuestions.length
    return securityQuestions[index]
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EDEDED] p-4">
      <Card className="w-full max-w-[400px] shadow-lg">
        <CardHeader className="bg-[#07C160] text-white rounded-t-lg">
          <div className="flex items-center mb-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#06A050] mr-2"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-xl font-bold">Recuperar cuenta</CardTitle>
          </div>
          <CardDescription className="text-white/80">
            {step === "email" && "Ingresa tu correo electrónico para recuperar tu cuenta"}
            {step === "security" && "Responde la pregunta de seguridad"}
            {step === "reset" && "Establece una nueva contraseña"}
            {step === "success" && "¡Contraseña restablecida con éxito!"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {step === "email" && (
            <form onSubmit={handleSubmitEmail}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-[#07C160]/30 focus:border-[#07C160] focus:ring-[#07C160]"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" className="w-full bg-[#07C160] hover:bg-[#06A050]" disabled={loading}>
                  {loading ? "Verificando..." : "Continuar"}
                </Button>
              </div>
            </form>
          )}

          {step === "security" && (
            <form onSubmit={handleSubmitSecurity}>
              <div className="grid gap-4">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-md">
                  <p className="font-medium">Verificación de identidad</p>
                  <p className="text-sm mt-1">Para proteger tu cuenta, responde la siguiente pregunta de seguridad.</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="security-question">{getRandomSecurityQuestion()}</Label>
                  <Input
                    id="security-question"
                    type="text"
                    placeholder="Tu respuesta"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    required
                    className="border-[#07C160]/30 focus:border-[#07C160] focus:ring-[#07C160]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Nota: Para esta demostración, puedes ingresar cualquier respuesta.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" className="w-full bg-[#07C160] hover:bg-[#06A050]" disabled={loading}>
                  {loading ? "Verificando..." : "Verificar"}
                </Button>
              </div>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="new-password">Nueva contraseña</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="border-[#07C160]/30 focus:border-[#07C160] focus:ring-[#07C160]"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Repite tu nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="border-[#07C160]/30 focus:border-[#07C160] focus:ring-[#07C160]"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" className="w-full bg-[#07C160] hover:bg-[#06A050]" disabled={loading}>
                  {loading ? "Actualizando..." : "Restablecer contraseña"}
                </Button>
              </div>
            </form>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-4">
              <CheckCircle2 className="h-16 w-16 text-[#07C160] mb-4" />
              <h3 className="text-xl font-semibold mb-2">¡Contraseña restablecida!</h3>
              <p className="text-center text-muted-foreground mb-4">
                Tu contraseña ha sido actualizada correctamente. Ahora puedes iniciar sesión con tu nueva contraseña.
              </p>
              <Button className="w-full bg-[#07C160] hover:bg-[#06A050]" onClick={() => router.push("/")}>
                Ir a iniciar sesión
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4 items-center text-sm">
          {step !== "success" && (
            <div className="w-full border-t pt-4">
              <p className="text-center mb-2">¿Recuerdas tus datos?</p>
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full border-[#07C160] text-[#07C160] hover:bg-[#07C160]/10">
                  Iniciar sesión
                </Button>
              </Link>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

