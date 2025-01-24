"use client"

import { useState, useEffect } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { BookingTable } from "./booking-table"

interface Booking {
  id: string
  name: string
  phone: string
  room: string
  date: string
  startTime: string
  endTime: string
}

export function BookingCalendarNew() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

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

  const hasBooking = (date: Date) => {
    return bookings.some((booking) => isSameDay(new Date(booking.date), date))
  }

  const filteredBookings = selectedDate
    ? bookings.filter((booking) => isSameDay(new Date(booking.date), selectedDate))
    : []

  return (
    <div className="space-y-4 w-[400px]">
      <Sheet>
        <SheetTrigger asChild>
          <div className="mt-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border "
              modifiers={{
                booked: (date) => hasBooking(date),
              }}
              modifiersStyles={{
                booked: { backgroundColor: "rgba(0, 120, 255, 0.1)" },
              }}
            />
          </div>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>{selectedDate && `Agendamentos para ${format(selectedDate, "dd/MM/yyyy")}`}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            <BookingTable bookings={filteredBookings} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

