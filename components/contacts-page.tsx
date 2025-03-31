"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, User, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useTranslation } from "@/lib/i18n/use-translation"

// Mock data for contacts
const mockContacts = [
  {
    id: "1",
    name: "Juan Pérez",
    phoneNumber: "+52 123 456 7890",
    email: "juan@example.com",
    usesApp: true,
    avatar: "https://avatar.vercel.sh/juan",
  },
  {
    id: "2",
    name: "María García",
    phoneNumber: "+52 234 567 8901",
    email: "maria@example.com",
    usesApp: true,
    avatar: "https://avatar.vercel.sh/maria",
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    phoneNumber: "+52 345 678 9012",
    email: "carlos@example.com",
    usesApp: false,
    avatar: "https://avatar.vercel.sh/carlos",
  },
  {
    id: "4",
    name: "Ana Martínez",
    phoneNumber: "+52 456 789 0123",
    email: "ana@example.com",
    usesApp: true,
    avatar: "https://avatar.vercel.sh/ana",
  },
  {
    id: "5",
    name: "Pedro López",
    phoneNumber: "+52 567 890 1234",
    email: "pedro@example.com",
    usesApp: false,
    avatar: "https://avatar.vercel.sh/pedro",
  },
  {
    id: "6",
    name: "Laura Sánchez",
    phoneNumber: "+52 678 901 2345",
    email: "laura@example.com",
    usesApp: true,
    avatar: "https://avatar.vercel.sh/laura",
  },
  {
    id: "7",
    name: "Miguel Torres",
    phoneNumber: "+52 789 012 3456",
    email: "miguel@example.com",
    usesApp: true,
    avatar: "https://avatar.vercel.sh/miguel",
  },
  {
    id: "8",
    name: "Sofía Ramírez",
    phoneNumber: "+52 890 123 4567",
    email: "sofia@example.com",
    usesApp: false,
    avatar: "https://avatar.vercel.sh/sofia",
  },
  {
    id: "9",
    name: "Javier Hernández",
    phoneNumber: "+52 901 234 5678",
    email: "javier@example.com",
    usesApp: true,
    avatar: "https://avatar.vercel.sh/javier",
  },
  {
    id: "10",
    name: "Daniela Flores",
    phoneNumber: "+52 012 345 6789",
    email: "daniela@example.com",
    usesApp: true,
    avatar: "https://avatar.vercel.sh/daniela",
  },
]

export default function ContactsPage() {
  const [contacts, setContacts] = useState(mockContacts)
  const [searchTerm, setSearchTerm] = useState("")
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()
  const { t } = useTranslation()

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || contact.phoneNumber.includes(searchTerm)

    if (activeTab === "app") {
      return matchesSearch && contact.usesApp
    }

    return matchesSearch
  })

  const handleRequestPermission = () => {
    // Simulate permission request
    setPermissionGranted(true)
  }

  const handleDenyPermission = () => {
    // Simulate permission denial
    setPermissionGranted(false)
  }

  const handleStartChat = (contactEmail: string) => {
    // In a real app, you would start a chat with this contact
    // For demo purposes, we'll just navigate to the chat page
    localStorage.setItem("selected-chat", contactEmail)
    router.push("/chat")
  }

  const handleInvite = (contactId: string) => {
    // Simulate sending an invitation
    alert(`Invitación enviada a ${contacts.find((c) => c.id === contactId)?.name}`)
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
          <h1 className="text-xl font-semibold">{t("contacts")}</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-[#06A050]"
          onClick={() => router.push("/search")}
        >
          <Search className="h-5 w-5" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-md mx-auto py-4 px-4">
        {permissionGranted === null ? (
          <div className="space-y-4">
            <Alert className="bg-white border-[#07C160]">
              <User className="h-4 w-4 text-[#07C160]" />
              <AlertTitle>{t("contactPermission")}</AlertTitle>
              <AlertDescription>{t("contactPermissionDesc")}</AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button className="flex-1 bg-[#07C160] hover:bg-[#06A050]" onClick={handleRequestPermission}>
                <Check className="mr-2 h-4 w-4" />
                {t("allow")}
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-[#07C160] text-[#07C160] hover:bg-[#07C160]/10"
                onClick={handleDenyPermission}
              >
                <X className="mr-2 h-4 w-4" />
                {t("deny")}
              </Button>
            </div>
          </div>
        ) : permissionGranted ? (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar contactos"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-white"
              />
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">{t("allContacts")}</TabsTrigger>
                <TabsTrigger value="app">{t("appContacts")}</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <ScrollArea className="h-[calc(100vh-220px)]">
                  <div className="space-y-1">
                    {filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={contact.avatar} />
                            <AvatarFallback className="bg-[#07C160] text-white">
                              {contact.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-sm text-muted-foreground">{contact.phoneNumber}</div>
                          </div>
                        </div>
                        {contact.usesApp ? (
                          <Button
                            size="sm"
                            className="bg-[#07C160] hover:bg-[#06A050]"
                            onClick={() => handleStartChat(contact.email)}
                          >
                            {t("message")}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#07C160] text-[#07C160] hover:bg-[#07C160]/10"
                            onClick={() => handleInvite(contact.id)}
                          >
                            {t("invite")}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="app" className="mt-4">
                <ScrollArea className="h-[calc(100vh-220px)]">
                  <div className="space-y-1">
                    {filteredContacts
                      .filter((contact) => contact.usesApp)
                      .map((contact) => (
                        <div
                          key={contact.id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={contact.avatar} />
                              <AvatarFallback className="bg-[#07C160] text-white">
                                {contact.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{contact.name}</div>
                              <div className="text-sm text-muted-foreground">{contact.phoneNumber}</div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-[#07C160] hover:bg-[#06A050]"
                            onClick={() => handleStartChat(contact.email)}
                          >
                            {t("message")}
                          </Button>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <User className="h-16 w-16 text-[#07C160] mb-4" />
            <h2 className="text-xl font-semibold mb-2">Permiso denegado</h2>
            <p className="text-muted-foreground mb-4">
              No podemos acceder a tus contactos. Puedes cambiar esto en la configuración de tu dispositivo.
            </p>
            <Button className="bg-[#07C160] hover:bg-[#06A050]" onClick={handleRequestPermission}>
              Intentar de nuevo
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

