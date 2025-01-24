"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, Phone } from "lucide-react"

interface Booking {
  id: string
  name: string
  phone: string
  room: string
  date: string
  startTime: string
  endTime: string
}

export function BookingTable() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: keyof Booking; direction: "asc" | "desc" }>({
    key: "room",
    direction: "asc",
  })

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("https://backagenda.onrender.com/bookings")
        const data = await response.json()
        setBookings(data)
      } catch (error) {
        console.error("Erro ao buscar os agendamentos:", error)
      }
    }
    fetchBookings()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  const requestSort = (key: keyof Booking) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const sortedBookings = [...bookings].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1
    }
    return 0
  })

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">
            <Button variant="ghost" onClick={() => requestSort("room")}>
              Sala
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => requestSort("date")}>
              Data
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Hora</TableHead>
          <TableHead>Usuário</TableHead>
          <TableHead>Contato</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedBookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell className="font-medium">{booking.room}</TableCell>
            <TableCell>{formatDate(booking.date)}</TableCell>
            <TableCell>{`${booking.startTime} - ${booking.endTime}`}</TableCell>
            <TableCell>{booking.name}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Contato</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <a
                      href={`https://wa.me/+55${booking.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      WhatsApp
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <a href={`tel:${booking.phone}`} className="flex items-center">
                      Ligar
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

