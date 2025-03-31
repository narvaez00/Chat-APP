"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/lib/i18n/use-translation"
import { type Language, type CountryCode, languageNames, countryNames } from "@/lib/i18n/translations"

export default function LanguageSettings() {
  const { t, language, country, autoDetect, changeLanguage, changeCountry, toggleAutoDetect } = useTranslation()
  const [activeTab, setActiveTab] = useState("language")
  const router = useRouter()

  const handleLanguageChange = (newLanguage: Language) => {
    changeLanguage(newLanguage)
  }

  const handleCountryChange = (newCountry: CountryCode) => {
    changeCountry(newCountry)
  }

  const handleAutoDetectChange = (checked: boolean) => {
    toggleAutoDetect(checked)
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
          <h1 className="text-xl font-semibold">{t("settings")}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-md mx-auto py-6 px-4">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>{t("languageSettings")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="language" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="language">{t("language")}</TabsTrigger>
                <TabsTrigger value="country">{t("country")}</TabsTrigger>
              </TabsList>

              <TabsContent value="language" className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-[#07C160]" />
                      <Label htmlFor="auto-detect-language">{t("autoDetect")}</Label>
                    </div>
                    <Switch id="auto-detect-language" checked={autoDetect} onCheckedChange={handleAutoDetectChange} />
                  </div>

                  <div className="pt-2">
                    <RadioGroup
                      value={language}
                      onValueChange={(value) => handleLanguageChange(value as Language)}
                      className="space-y-2"
                      disabled={autoDetect}
                    >
                      {Object.entries(languageNames).map(([code, name]) => (
                        <div
                          key={code}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            autoDetect ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"
                          } ${language === code ? "border-[#07C160] bg-[#07C160]/5" : "border-gray-200"}`}
                          onClick={() => !autoDetect && handleLanguageChange(code as Language)}
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem
                              value={code}
                              id={`language-${code}`}
                              disabled={autoDetect}
                              className="text-[#07C160]"
                            />
                            <Label
                              htmlFor={`language-${code}`}
                              className={`font-medium ${autoDetect ? "cursor-not-allowed" : "cursor-pointer"}`}
                            >
                              {name}
                            </Label>
                          </div>
                          {language === code && <Check className="h-5 w-5 text-[#07C160]" />}
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="country" className="pt-4">
                <ScrollArea className="h-[400px] pr-4">
                  <RadioGroup
                    value={country || ""}
                    onValueChange={(value) => handleCountryChange(value as CountryCode)}
                    className="space-y-2"
                  >
                    {Object.entries(countryNames).map(([code, name]) => (
                      <div
                        key={code}
                        className={`flex items-center justify-between p-3 rounded-lg border hover:bg-gray-100 cursor-pointer ${
                          country === code ? "border-[#07C160] bg-[#07C160]/5" : "border-gray-200"
                        }`}
                        onClick={() => handleCountryChange(code as CountryCode)}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={code} id={`country-${code}`} className="text-[#07C160]" />
                          <Label htmlFor={`country-${code}`} className="font-medium cursor-pointer">
                            {name}
                          </Label>
                        </div>
                        {country === code && <Check className="h-5 w-5 text-[#07C160]" />}
                      </div>
                    ))}
                  </RadioGroup>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

