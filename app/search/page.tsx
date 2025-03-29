"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import BookSearchResults from "@/components/book-search-results"
import type { Book } from "@/types/book"

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [searchType, setSearchType] = useState<"title" | "author">("title")
  const [isLoading, setIsLoading] = useState(false)
  const [books, setBooks] = useState<Book[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    // Verificar autenticación
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
    }
  }, [router])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    setIsLoading(true)
    setError("")

    try {
      // Construir la URL de búsqueda para Google Books API
      const searchParam = searchType === "author" ? "inauthor" : "intitle"
      const url = `https://www.googleapis.com/books/v1/volumes?q=${searchParam}:${encodeURIComponent(query)}&maxResults=20`

      const response = await fetch(url)
      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message || "Error en la búsqueda")
      }

      if (!data.items || data.items.length === 0) {
        setBooks([])
        setError("No se encontraron libros con esa búsqueda")
        return
      }

      // Transformar los resultados al formato de nuestra aplicación
      const formattedBooks: Book[] = data.items.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title || "Título desconocido",
        authors: item.volumeInfo.authors || ["Autor desconocido"],
        description: item.volumeInfo.description || "Sin descripción disponible",
        coverImage: item.volumeInfo.imageLinks?.thumbnail || "/placeholder.svg?height=200&width=150",
        publishedDate: item.volumeInfo.publishedDate || "Fecha desconocida",
        pageCount: item.volumeInfo.pageCount || 0,
        categories: item.volumeInfo.categories || [],
      }))

      setBooks(formattedBooks)
    } catch (err) {
      console.error("Error al buscar libros:", err)
      setError("Error al buscar libros. Por favor, intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const addToList = (book: Book, listName: string) => {
    // Obtener la lista actual
    const storedList = localStorage.getItem(listName)
    const currentList: Book[] = storedList ? JSON.parse(storedList) : []

    // Verificar si el libro ya está en la lista
    if (currentList.some((item) => item.id === book.id)) {
      return
    }

    // Añadir el libro a la lista
    const updatedList = [...currentList, book]
    localStorage.setItem(listName, JSON.stringify(updatedList))

    // Mostrar confirmación
    alert(
      `Libro añadido a ${listName === "wantToRead" ? "Quiero Leer" : listName === "reading" ? "Leyendo" : "Terminados"}`,
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Buscar Libros</h1>
        <p className="text-muted-foreground">Busca libros por título o autor y añádelos a tus colecciones</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar libros..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={searchType === "title" ? "default" : "outline"}
                onClick={() => setSearchType("title")}
                disabled={isLoading}
              >
                Título
              </Button>
              <Button
                type="button"
                variant={searchType === "author" ? "default" : "outline"}
                onClick={() => setSearchType("author")}
                disabled={isLoading}
              >
                Autor
              </Button>
              <Button type="submit" disabled={isLoading || !query.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buscando
                  </>
                ) : (
                  "Buscar"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {error && <div className="bg-destructive/10 text-destructive p-4 rounded-md">{error}</div>}

      <BookSearchResults books={books} onAddToList={addToList} />
    </div>
  )
}

