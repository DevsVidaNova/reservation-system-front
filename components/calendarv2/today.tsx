'use client'

import { format, getDay, parse, isSameDay } from 'date-fns'
import {ptBR} from 'date-fns/locale/pt-BR'

type Event = {
  id: number
  description: string
  date: string // formato "dd/MM/yyyy"
  start_time: string
  end_time: string
  repeat: string | null
  repeat_day: string | null // tipo "Seg", "Ter", "Qua", etc
  room: {
    name: string
  }
  user: {
    name: string
  }
}

type Props = {
  events: Event[]
}

// Mapeia `getDay()` para string de dia
const dayOfWeekMap = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function TodayEventsList({ events }: Props) {
  const today = new Date()
  const todayStr = format(today, 'dd/MM/yyyy')
  const todayDayOfWeek = dayOfWeekMap[getDay(today)]

  const todayEvents = events
    .filter(event => {
      // Evento com data exata hoje
      if (event.date === todayStr) return true

      // Evento recorrente (repeat_day) no dia certo
      if (event.repeat && event.repeat_day === todayDayOfWeek) {
        const eventDate = parse(event.date, 'dd/MM/yyyy', new Date())
        // Não exibe se já for uma instância exata de hoje
        return !isSameDay(eventDate, today)
      }

      return false
    })
    .sort((a, b) => a.start_time.localeCompare(b.start_time))

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-xl shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-3">
        📅 Hoje – {format(today, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
      </h3>

      {todayEvents.length === 0 ? (
        <p className="text-gray-500">Nenhum evento marcado para hoje.</p>
      ) : (
        <ul className="space-y-3">
          {todayEvents.map(event => (
            <li key={`${event.id}-${event.date}`} className="border-l-4 border-emerald-500 pl-4">
              <div className="flex justify-between items-center text-sm text-gray-700">
                <span className="font-medium">
                  🕒 {event.start_time} às {event.end_time}
                </span>
                <span className="text-gray-500 text-xs">{event.room.name}</span>
              </div>
              <div className="font-semibold">{event.description}</div>
              <div className="text-xs text-gray-500">Responsável: {event.user.name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
