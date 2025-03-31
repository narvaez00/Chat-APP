"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/lib/i18n/use-translation"

// Mock data for users
const mockUsers = [
  {
    id: "1",
    name: "Juan Pérez",
    username: "juanperez",
    email: "juan@example.com",
    avatar: "https://avatar.vercel.sh/juan",
  },
  {
    id: "2",
    name: "María García",
    username: "mariagarcia",
    email: "maria@example.com",
    avatar: "https://avatar.vercel.sh/maria",
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    username: "carlosrodriguez",
    email: "carlos@example.com",
    avatar: "https://avatar.vercel.sh/carlos",
  },
  {
    id: "4",
    name: "Ana Martínez",
    username: "anamartinez",
    email: "ana@example.com",
    avatar: "https://avatar.vercel.sh/ana",
  },
  {
    id: "5",
    name: "Pedro López",
    username: "pedrolopez",
    email: "pedro@example.com",
    avatar: "https://avatar.vercel.sh/pedro",
  },
  {
    id: "6",
    name: "Laura Sánchez",
    username: "laurasanchez",
    email: "laura@example.com",
    avatar: "https://avatar.vercel.sh/laura",
  },
  {
    id: "7",
    name: "Miguel Torres",
    username: "migueltorres",
    email: "miguel@example.com",
    avatar: "https://avatar.vercel.sh/miguel",
  },
  {
    id: "8",
    name: "Sofía Ramírez",
    username: "sofiaramirez",
    email: "sofia@example.com",
    avatar: "https://avatar.vercel.sh/sofia",
  },
  {
    id: "9",
    name: "Javier Hernández",
    username: "javierhernandez",
    email: "javier@example.com",
    avatar: "https://avatar.vercel.sh/javier",
  },
  {
    id: "10",
    name: "Daniela Flores",
    username: "danielaflores",
    email: "daniela@example.com",
    avatar: "https://avatar.vercel.sh/daniela",
  },
  {
    id: "11",
    name: "Roberto Gómez",
    username: "robertogomez",
    email: "roberto@example.com",
    avatar: "https://avatar.vercel.sh/roberto",
  },
  {
    id: "12",
    name: "Carmen Díaz",
    username: "carmendiaz",
    email: "carmen@example.com",
    avatar: "https://avatar.vercel.sh/carmen",
  },
  {
    id: "13",
    name: "Fernando Ruiz",
    username: "fernandoruiz",
    email: "fernando@example.com",
    avatar: "https://avatar.vercel.sh/fernando",
  },
  {
    id: "14",
    name: "Patricia Morales",
    username: "patriciamorales",
    email: "patricia@example.com",
    avatar: "https://avatar.vercel.sh/patricia",
  },
  {
    id: "15",
    name: "Alejandro Vargas",
    username: "alejandrovargas",
    email: "alejandro@example.com",
    avatar: "https://avatar.vercel.sh/alejandro",
  },
]

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState(mockUsers)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem("recent-searches")
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const results = mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setSearchResults(results)
    } else {
      setSearchResults(mockUsers)
    }
  }, [searchTerm])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (searchTerm) {
      // Add to recent searches
      const updatedSearches = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(0, 5)
      setRecentSearches(updatedSearches)
      localStorage.setItem("recent-searches", JSON.stringify(updatedSearches))
    }
  }

  const handleStartChat = (userEmail: string) => {
    // In a real app, you would start a chat with this user
    // For demo purposes, we'll just navigate to the chat page
    localStorage.setItem("selected-chat", userEmail)
    router.push("/chat")
  }

  const handleClearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recent-searches")
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
          <h1 className="text-xl font-semibold">{t("searchUsers")}</h1>
        </div>
      </header>

      {/* Search Form */}
      <div className="bg-[#07C160] text-white px-4 pb-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white text-black"
          />
        </form>
      </div>

      {/* Main Content */}
      <main className="flex-1 container max-w-md mx-auto py-4 px-4">
        <Tabs defaultValue="results">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="results">{t("results")}</TabsTrigger>
            <TabsTrigger value="recent">{t("recentSearches")}</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="mt-4">
            <ScrollArea className="h-[calc(100vh-200px)]">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-[#07C160] text-white">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">@{user.username}</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-[#07C160] hover:bg-[#06A050]"
                        onClick={() => handleStartChat(user.email)}
                      >
                        {t("message")}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Search className="h-16 w-16 text-[#07C160] mb-4" />
                  <h2 className="text-xl font-semibold mb-2">{t("noResults")}</h2>
                  <p className="text-muted-foreground">{t("tryOtherTerm")}</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="recent" className="mt-4">
            <ScrollArea className="h-[calc(100vh-200px)]">
              {recentSearches.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Búsquedas recientes</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#07C160] hover:text-[#06A050] hover:bg-transparent"
                      onClick={handleClearRecentSearches}
                    >
                      {t("clearAll")}
                    </Button>
                  </div>

                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                        onClick={() => setSearchTerm(search)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <Search className="h-4 w-4 text-gray-500" />
                          </div>
                          <div className="font-medium">{search}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500"
                          onClick={(e) => {
                            e.stopPropagation()
                            setRecentSearches(recentSearches.filter((s) => s !== search))
                            localStorage.setItem(
                              "recent-searches",
                              JSON.stringify(recentSearches.filter((s) => s !== search)),
                            )
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Search className="h-16 w-16 text-[#07C160] mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No hay búsquedas recientes</h2>
                  <p className="text-muted-foreground">Tus búsquedas recientes aparecerán aquí</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

