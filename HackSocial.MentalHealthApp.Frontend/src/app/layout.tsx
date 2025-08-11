import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LUMINA AI - Your Compassionate Digital Companion",
  description:
    "24/7 AI-powered mental health support with empathetic chat, mood tracking, guided journaling, and evidence-based tools for anxiety, depression, and wellness.",
  icons: {
    icon: "/luminaai.png", 
  },
  }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
