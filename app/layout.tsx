import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"
// Importar el componente PWAInstallPrompt
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
// Importar el componente OfflineIndicator
import { OfflineIndicator } from "@/components/offline-indicator"

export const metadata: Metadata = {
  title: "Chat App",
  description: "Una aplicación de chat para Android e iPhone",
  generator: "v0.dev",
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
  themeColor: "#07C160",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#07C160" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <PWAInstallPrompt />
          <OfflineIndicator />
        </ThemeProvider>
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('Service Worker registrado con éxito:', registration.scope);
                  },
                  function(err) {
                    console.log('Error al registrar el Service Worker:', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}



import './globals.css'