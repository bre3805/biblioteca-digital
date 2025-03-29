"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import type { Book } from "@/types/book"
import { Card, CardContent } from "@/components/ui/card"
import { MoreHorizontal, Trash2, ArrowRight } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface BookListProps {
  books: Book[]
  onRemove: (id: string) => void
  onMove: (book: Book) => void
  moveLabel: string
}

export default function BookList({ books, onRemove, onMove, moveLabel }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay libros en esta lista. Busca libros para añadirlos.
      </div>
    )
  }

  return (
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
                <div className="mt-auto pt-4 flex justify-between items-center">
                  <Button variant="outline" size="sm" onClick={() => onMove(book)}>
                    {moveLabel}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Más opciones</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onRemove(book.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

