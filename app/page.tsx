import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-4xl font-bold mb-6">Bienvenido a Mi Biblioteca Digital</h1>
      <p className="text-xl mb-8 max-w-2xl">
        Tu espacio personal para descubrir, organizar y gestionar tus libros favoritos. Busca libros, crea colecciones
        personalizadas y lleva un registro de tu lectura.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/login">Iniciar Sesión</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/register">Registrarse</Link>
        </Button>
      </div>
    </div>
  )
}

