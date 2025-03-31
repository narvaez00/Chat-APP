"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Camera, LogOut, Upload, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/lib/i18n/use-translation"

export default function ProfileSettings() {
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [selectedTab, setSelectedTab] = useState("profile")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  // Translation hook
  const { t } = useTranslation()

  // Sample avatar options
  const avatarOptions = [
    "/placeholder.svg?height=100&width=100",
    `https://avatar.vercel.sh/user1?size=100`,
    `https://avatar.vercel.sh/user2?size=100`,
    `https://avatar.vercel.sh/user3?size=100`,
    `https://avatar.vercel.sh/user4?size=100`,
    `https://avatar.vercel.sh/user5?size=100`,
    `https://avatar.vercel.sh/user6?size=100`,
    `https://avatar.vercel.sh/user7?size=100`,
    `https://avatar.vercel.sh/user8?size=100`,
  ]

  useEffect(() => {
    // Check if user is logged in
    const email = localStorage.getItem("user-email")
    const name = localStorage.getItem("user-name")
    const image = localStorage.getItem("user-profile-image")

    if (!email) {
      router.push("/")
      return
    }

    setUserEmail(email)
    setUserName(name || email.split("@")[0])
    setProfileImage(image || `https://avatar.vercel.sh/${email}`)
  }, [router])

  const handleSaveProfile = () => {
    setLoading(true)

    // Simulate saving delay
    setTimeout(() => {
      localStorage.setItem("user-name", userName)
      localStorage.setItem("user-profile-image", profileImage)
      setSuccess(true)
      setLoading(false)

      // Reset success message after 2 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 2000)
    }, 1000)
  }

  const handleSelectAvatar = (avatar: string) => {
    setProfileImage(avatar)

    // Guardar inmediatamente en localStorage
    localStorage.setItem("user-profile-image", avatar)

    // Mostrar mensaje de éxito
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
    }, 2000)
  }

  const handleLogout = () => {
    localStorage.removeItem("user-email")
    localStorage.removeItem("user-name")
    localStorage.removeItem("user-profile-image")
    router.push("/")
  }

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Crear una URL para la imagen seleccionada
      const imageUrl = URL.createObjectURL(file)
      setProfileImage(imageUrl)

      // Guardar inmediatamente en localStorage para persistir el cambio
      localStorage.setItem("user-profile-image", imageUrl)

      // Mostrar mensaje de éxito
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 2000)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#EDEDED]">
      {/* Header */}
      <header className="bg-[#07C160] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-[#06A050]"
            onClick={() => router.push("/chat")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">{t("profile")}</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-white hover:bg-[#06A050]" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-md mx-auto py-6 px-4">
        <Card className="shadow-md">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                  <AvatarImage src={profileImage} />
                  <AvatarFallback className="bg-[#07C160] text-white text-2xl">
                    {userName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-[#07C160] text-white p-1.5 rounded-full cursor-pointer shadow-md hover:bg-[#06A050]"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadImage}
                  />
                </label>
              </div>
            </div>
            <CardTitle>{userName}</CardTitle>
            <CardDescription>{userEmail}</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="profile" value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Perfil</TabsTrigger>
                <TabsTrigger value="avatar">Foto de perfil</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("name")}</Label>
                    <Input
                      id="name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="border-[#07C160]/30 focus:border-[#07C160] focus:ring-[#07C160]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("email")}</Label>
                    <Input id="email" value={userEmail} disabled className="bg-gray-50" />
                  </div>

                  <Button
                    className="w-full bg-[#07C160] hover:bg-[#06A050]"
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    {loading ? `${t("save")}...` : t("save")}
                  </Button>

                  {success && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-md text-center">{t("profileUpdated")}</div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="avatar" className="pt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {avatarOptions.map((avatar, index) => (
                      <div
                        key={index}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                          profileImage === avatar ? "border-[#07C160]" : "border-transparent"
                        }`}
                        onClick={() => handleSelectAvatar(avatar)}
                      >
                        <Avatar className="h-full w-full">
                          <AvatarImage src={avatar} className="object-cover" />
                          <AvatarFallback className="bg-[#07C160]/20">
                            <User className="h-6 w-6 text-[#07C160]" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    ))}
                  </div>

                  <div className="relative">
                    <Button
                      variant="outline"
                      className="w-full border-dashed border-[#07C160] text-[#07C160] hover:bg-[#07C160]/10"
                      onClick={() => document.getElementById("avatar-upload")?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Subir imagen
                    </Button>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadImage}
                    />
                  </div>

                  <Button
                    className="w-full bg-[#07C160] hover:bg-[#06A050]"
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    {loading ? `${t("save")}...` : t("save")}
                  </Button>

                  {success && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-md text-center">{t("profileUpdated")}</div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex justify-center pt-2">
            <Button variant="destructive" className="bg-red-500 hover:bg-red-600" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t("logout")}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

