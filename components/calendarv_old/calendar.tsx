// app/components/Calendar.tsx
'use client'

import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

type Event = {
  id: number
  description: string
  date: string // formato "dd/MM/yyyy"
}

type Props = {
  events: Event[]
}

export default function Calendar({ events }: Props) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today)

  const start = startOfMonth(currentMonth)
  const end = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start, end })

  const colors =['bg-emerald-600', 'bg-blue-600', 'bg-pink-600', 'bg-purple-600']

  const startWeekday = getDay(start) 

  const eventsByDate = events.reduce((acc, event) => {
    acc[event.date] = acc[event.date] || []
    acc[event.date].push(event)
    return acc
  }, {} as Record<string, Event[]>)

  const formattedMonth = format(currentMonth, 'MMMM yyyy', { locale: ptBR })

  return (
    <div className="mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-4 capitalize">{formattedMonth}</h2>

      <div className="grid grid-cols-7  text-center text-sm font-medium">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
          <div key={d} className="text-gray-600 text-xl">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 mt-2">
        {[...Array(startWeekday).fill(null), ...days].map((date, i) => {
          if (!date) return <div key={i}></div>

          const dateStr = format(date, 'dd/MM/yyyy')
          const dayEvents = eventsByDate[dateStr] || []

          return (
            <div key={i} className="border h-34 p-1 w-34 flex flex-col items-start justify-start">
              <span className="text-xl font-bold mt-2 ml-2">{format(date, 'd')}</span>
              <div className="flex flex-col mt-1">
                {dayEvents.map(event => {
                  const selectColor = colors[Math.floor(Math.random() * colors.length)];
                  return (
                  <span
                    key={event.id}
                    className={`${selectColor} text-white text-[10px] rounded px-1 py-0.5 truncate w-30`}
                    title={event.description}
                  >
                    {event.description.length > 32 ? event.description.slice(0,32) + '...' : event.description}
                  </span>
                )})}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
