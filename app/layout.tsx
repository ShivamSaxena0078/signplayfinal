import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { AuthProvider } from "@/components/context/AuthContext"
import "./globals.css"

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"]
})

export const metadata: Metadata = {
  title: "SignPlay - Learn Sign Language Numbers",
  description: "An interactive learning platform for deaf and mute children to learn sign language and play math games.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
