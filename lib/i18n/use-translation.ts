"use client"

import { useEffect, useState } from "react"
import { type Language, type CountryCode, countryToLanguage, translations } from "./translations"

// Function to get browser language
const getBrowserLanguage = (): Language => {
  if (typeof window === "undefined") return "en"

  const browserLang = navigator.language.split("-")[0]
  if (browserLang === "es" || browserLang === "pt" || browserLang === "zh") {
    return browserLang as Language
  }
  return "en"
}

// Function to simulate country detection based on IP
const simulateCountryDetection = (): CountryCode => {
  // In a real app, this would be an API call to detect the country based on IP
  // For demo purposes, we'll return a random country from our supported list
  const countries: CountryCode[] = ["CO", "MX", "US", "HN", "VE", "PE", "CR", "GT", "SV", "BZ", "BR", "CN"]
  return countries[Math.floor(Math.random() * countries.length)]
}

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>("en")
  const [country, setCountry] = useState<CountryCode | null>(null)
  const [autoDetect, setAutoDetect] = useState(true)

  useEffect(() => {
    // Load language and country from localStorage if available
    const savedLanguage = localStorage.getItem("app-language") as Language
    const savedCountry = localStorage.getItem("app-country") as CountryCode
    const savedAutoDetect = localStorage.getItem("app-auto-detect")

    if (savedLanguage) {
      setLanguage(savedLanguage)
    } else {
      // If no saved language, use browser language
      setLanguage(getBrowserLanguage())
    }

    if (savedCountry) {
      setCountry(savedCountry)
    }

    if (savedAutoDetect !== null) {
      setAutoDetect(savedAutoDetect === "true")
    }

    // If auto-detect is enabled or no country is set, detect country
    if ((savedAutoDetect === null || savedAutoDetect === "true") && !savedCountry) {
      const detectedCountry = simulateCountryDetection()
      setCountry(detectedCountry)
      localStorage.setItem("app-country", detectedCountry)

      // If language is not set, set it based on detected country
      if (!savedLanguage) {
        const countryLanguage = countryToLanguage[detectedCountry]
        setLanguage(countryLanguage)
        localStorage.setItem("app-language", countryLanguage)
      }
    }
  }, [])

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("app-language", newLanguage)
  }

  const changeCountry = (newCountry: CountryCode) => {
    setCountry(newCountry)
    localStorage.setItem("app-country", newCountry)

    // If auto-detect is enabled, also change language based on country
    if (autoDetect) {
      const countryLanguage = countryToLanguage[newCountry]
      setLanguage(countryLanguage)
      localStorage.setItem("app-language", countryLanguage)
    }
  }

  const toggleAutoDetect = (value: boolean) => {
    setAutoDetect(value)
    localStorage.setItem("app-auto-detect", value.toString())

    // If enabling auto-detect and country is set, update language
    if (value && country) {
      const countryLanguage = countryToLanguage[country]
      setLanguage(countryLanguage)
      localStorage.setItem("app-language", countryLanguage)
    }
  }

  const t = (key: string): string => {
    const keys = key.split(".")
    let result = translations[language]

    for (const k of keys) {
      if (result && typeof result === "object" && k in result) {
        result = result[k as keyof typeof result]
      } else {
        // Fallback to English if key not found
        let fallback = translations["en"]
        for (const fk of keys) {
          if (fallback && typeof fallback === "object" && fk in fallback) {
            fallback = fallback[fk as keyof typeof fallback]
          } else {
            return key // Return the key itself if not found in fallback
          }
        }
        return fallback as string
      }
    }

    return result as string
  }

  return {
    t,
    language,
    country,
    autoDetect,
    changeLanguage,
    changeCountry,
    toggleAutoDetect,
  }
}

