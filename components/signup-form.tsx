"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useTranslation } from "@/lib/i18n/use-translation"
import { registerUser, getUsers } from "@/lib/auth-service"

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [emailExists, setEmailExists] = useState(false)
  const router = useRouter()

  const { t } = useTranslation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (error) setError("")

    // Check if email exists when typing in email field
    if (name === "email" && value) {
      const users = getUsers()
      const exists = users.some((user) => user.email.toLowerCase() === value.toLowerCase())
      setEmailExists(exists)
    } else {
      setEmailExists(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setLoading(false)
      return
    }

    // Check if email already exists
    if (emailExists) {
      setError("Este correo electrónico ya está registrado. Por favor, inicia sesión.")
      setLoading(false)
      return
    }

    // Register user
    const result = registerUser(formData.email, formData.password, formData.name)

    if (result.success) {
      // Save user session
      localStorage.setItem("user-email", formData.email)
      localStorage.setItem("user-name", formData.name || formData.email.split("@")[0])

      setSuccess(true)

      // Redirect after showing success message
      setTimeout(() => {
        router.push("/chat")
      }, 1500)
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  const handleLoginRedirect = () => {
    if (emailExists) {
      router.push("/?email=" + encodeURIComponent(formData.email))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EDEDED] p-4">
      <Card className="w-full max-w-[400px] shadow-lg">
        <CardHeader className="bg-[#07C160] text-white rounded-t-lg">
          <CardTitle className="text-center text-2xl font-bold">{t("signup")}</CardTitle>
          <CardDescription className="text-center text-white/80">{t("signup")}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-4">
              <CheckCircle2 className="h-16 w-16 text-[#07C160] mb-4" />
              <h3 className="text-xl font-semibold mb-2">¡Registro exitoso!</h3>
              <p className="text-center text-muted-foreground">
                Tu cuenta ha sido creada correctamente. Redirigiendo...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{t("name")}</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Tu nombre completo"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border-[#07C160]/30 focus:border-[#07C160] focus:ring-[#07C160]"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    placeholder="tu@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`border-[#07C160]/30 focus:border-[#07C160] focus:ring-[#07C160] ${
                      emailExists ? "border-yellow-500 bg-yellow-50" : ""
                    }`}
                  />
                  {emailExists && (
                    <div className="bg-yellow-50 text-yellow-600 p-3 rounded-md flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>Este correo ya está registrado.</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-yellow-500 text-yellow-600 hover:bg-yellow-100"
                        onClick={handleLoginRedirect}
                      >
                        Ir a iniciar sesión
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="border-[#07C160]/30 focus:border-[#07C160] focus:ring-[#07C160]"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Repite tu contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
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

                <Button type="submit" className="w-full bg-[#07C160] hover:bg-[#06A050] mt-2" disabled={loading}>
                  {loading ? `${t("signup")}...` : t("signup")}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4 items-center text-sm">
          <p className="text-muted-foreground text-center">{t("terms")}</p>
          <div className="w-full border-t pt-4">
            <p className="text-center mb-2">{t("haveAccount")}</p>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full border-[#07C160] text-[#07C160] hover:bg-[#07C160]/10">
                {t("login")}
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

