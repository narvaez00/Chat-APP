"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { useTranslation } from "@/lib/i18n/use-translation"
import { loginUser } from "@/lib/auth-service"

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate form
    if (!formData.email || !formData.password) {
      setError("Por favor, completa todos los campos.")
      setLoading(false)
      return
    }

    // Attempt login
    const result = loginUser(formData.email, formData.password)

    if (result.success) {
      // Save user session
      localStorage.setItem("user-email", formData.email)
      if (result.user?.name) {
        localStorage.setItem("user-name", result.user.name)
      }
      if (result.user?.profileImage) {
        localStorage.setItem("user-profile-image", result.user.profileImage)
      }

      // Redirect to chat
      router.push("/chat")
    } else {
      setError(result.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EDEDED] p-4">
      <Card className="w-full max-w-[350px] shadow-lg">
        <CardHeader className="bg-[#07C160] text-white rounded-t-lg">
          <CardTitle className="text-center text-2xl font-bold">{t("appName")}</CardTitle>
          <CardDescription className="text-center text-white/80">{t("login")}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  placeholder={t("email")}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-[#07C160]/30 focus:border-[#07C160] focus:ring-[#07C160]"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Link href="/recover" className="text-xs text-[#07C160] hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={t("password")}
                  value={formData.password}
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

              <Button type="submit" className="w-full bg-[#07C160] hover:bg-[#06A050]" disabled={loading}>
                {loading ? `${t("login")}...` : t("login")}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 items-center text-sm">
          <p className="text-muted-foreground text-center">{t("terms")}</p>
          <div className="w-full border-t pt-4">
            <p className="text-center mb-2">{t("noAccount")}</p>
            <Link href="/signup" className="w-full">
              <Button variant="outline" className="w-full border-[#07C160] text-[#07C160] hover:bg-[#07C160]/10">
                {t("signup")}
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

