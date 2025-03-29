"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import BookList from "@/components/book-list"
import type { Book } from "@/types/book"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null)
  const [wantToRead, setWantToRead] = useState<Book[]>([])
  const [reading, setReading] = useState<Book[]>([])
  const [finished, setFinished] = useState<Book[]>([])

  useEffect(() => {
    // Verificar autenticación
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(storedUser))

    // Cargar listas de libros desde localStorage
    const storedWantToRead = localStorage.getItem("wantToRead")
    const storedReading = localStorage.getItem("reading")
    const storedFinished = localStorage.getItem("finished")

    if (storedWantToRead) setWantToRead(JSON.parse(storedWantToRead))
    if (storedReading) setReading(JSON.parse(storedReading))
    if (storedFinished) setFinished(JSON.parse(storedFinished))
  }, [router])

  const removeFromList = (bookId: string, listName: string) => {
    if (listName === "wantToRead") {
      const updatedList = wantToRead.filter((book) => book.id !== bookId)
      setWantToRead(updatedList)
      localStorage.setItem("wantToRead", JSON.stringify(updatedList))
    } else if (listName === "reading") {
      const updatedList = reading.filter((book) => book.id !== bookId)
      setReading(updatedList)
      localStorage.setItem("reading", JSON.stringify(updatedList))
    } else if (listName === "finished") {
      const updatedList = finished.filter((book) => book.id !== bookId)
      setFinished(updatedList)
      localStorage.setItem("finished", JSON.stringify(updatedList))
    }
  }

  const moveBook = (book: Book, fromList: string, toList: string) => {
    // Eliminar de la lista original
    removeFromList(book.id, fromList)

    // Añadir a la nueva lista
    if (toList === "wantToRead") {
      const updatedList = [...wantToRead, book]
      setWantToRead(updatedList)
      localStorage.setItem("wantToRead", JSON.stringify(updatedList))
    } else if (toList === "reading") {
      const updatedList = [...reading, book]
      setReading(updatedList)
      localStorage.setItem("reading", JSON.stringify(updatedList))
    } else if (toList === "finished") {
      const updatedList = [...finished, book]
      setFinished(updatedList)
      localStorage.setItem("finished", JSON.stringify(updatedList))
    }
  }

  if (!user) {
    return <div className="flex justify-center items-center min-h-[80vh]">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mi Biblioteca</h1>
        <p className="text-muted-foreground">
          Bienvenido, {user.name || user.email}. Gestiona tus libros y colecciones.
        </p>
      </div>

      <Tabs defaultValue="wantToRead">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="wantToRead">Quiero Leer ({wantToRead.length})</TabsTrigger>
          <TabsTrigger value="reading">Leyendo ({reading.length})</TabsTrigger>
          <TabsTrigger value="finished">Terminados ({finished.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="wantToRead">
          <Card>
            <CardHeader>
              <CardTitle>Libros que quiero leer</CardTitle>
              <CardDescription>Libros que has guardado para leer en el futuro.</CardDescription>
            </CardHeader>
            <CardContent>
              <BookList
                books={wantToRead}
                onRemove={(id) => removeFromList(id, "wantToRead")}
                onMove={(book) => moveBook(book, "wantToRead", "reading")}
                moveLabel="Mover a Leyendo"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reading">
          <Card>
            <CardHeader>
              <CardTitle>Libros que estoy leyendo</CardTitle>
              <CardDescription>Libros que estás leyendo actualmente.</CardDescription>
            </CardHeader>
            <CardContent>
              <BookList
                books={reading}
                onRemove={(id) => removeFromList(id, "reading")}
                onMove={(book) => moveBook(book, "reading", "finished")}
                moveLabel="Mover a Terminados"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finished">
          <Card>
            <CardHeader>
              <CardTitle>Libros terminados</CardTitle>
              <CardDescription>Libros que has terminado de leer.</CardDescription>
            </CardHeader>
            <CardContent>
              <BookList
                books={finished}
                onRemove={(id) => removeFromList(id, "finished")}
                onMove={(book) => moveBook(book, "finished", "wantToRead")}
                moveLabel="Leer de nuevo"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

