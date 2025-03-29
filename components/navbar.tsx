"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export default function Navbar() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Verificar si hay un usuario en localStorage
    const user = localStorage.getItem("user")
    setIsLoggedIn(!!user)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    window.location.href = "/"
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          MiBiblioteca
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className={pathname === "/" ? "font-medium" : "text-muted-foreground"}>
            Inicio
          </Link>
          {isLoggedIn && (
            <>
              <Link href="/dashboard" className={pathname === "/dashboard" ? "font-medium" : "text-muted-foreground"}>
                Mi Biblioteca
              </Link>
              <Link href="/search" className={pathname === "/search" ? "font-medium" : "text-muted-foreground"}>
                Buscar Libros
              </Link>
            </>
          )}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <Button onClick={handleLogout} variant="outline">
                Cerrar Sesión
              </Button>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Registrarse</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

