"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import type { Book } from "@/types/book"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BookPlus } from "lucide-react"

interface BookSearchResultsProps {
  books: Book[]
  onAddToList: (book: Book, listName: string) => void
}

export default function BookSearchResults({ books, onAddToList }: BookSearchResultsProps) {
  if (books.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Resultados de búsqueda</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <Card key={book.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col h-full">
                <div className="relative h-48 w-full bg-muted">
                  <Image src={book.coverImage || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{book.authors.join(", ")}</p>
                  <p className="text-sm mt-2 line-clamp-3">{book.description}</p>
                  <div className="mt-auto pt-4 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button>
                          <BookPlus className="mr-2 h-4 w-4" />
                          Añadir a lista
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onAddToList(book, "wantToRead")}>Quiero leer</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAddToList(book, "reading")}>Leyendo</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAddToList(book, "finished")}>Terminado</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

