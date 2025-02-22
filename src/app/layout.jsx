'use client'
import "./globals.css"
import NavBar from "../components/NavBar"
import Footer from "../components/Footer"
import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "@/context/AuthContext"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="font-inter bg-[#09090B] max-w-5xl mx-auto">
        <SessionProvider>
          <AuthProvider>
          {children} {/* Esto renderiza todas las páginas */}
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
