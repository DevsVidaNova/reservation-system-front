'use client';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
dayjs.locale('pt-br');
import { useQuery } from '@tanstack/react-query';
import { listBookingsCalendar } from '@/app/__api/booking';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [daysInMonth, setDaysInMonth] = useState([]);

  const { data: weekbookings, error: weekbookingserror, isLoading: weekbookingsloading } = useQuery({
    queryKey: ['calendar bookings'],
    queryFn: listBookingsCalendar,
  });


  useEffect(() => {
    generateCalendar(currentDate);
  }, [currentDate]);

  const generateCalendar = (date) => {
    const startOfMonth = date.startOf('month');
    const endOfMonth = date.endOf('month');
    const days = [];

    let currentDay = startOfMonth;
    while (currentDay.isBefore(endOfMonth, 'day')) {
      days.push(currentDay);
      currentDay = currentDay.add(1, 'day');
    }

    setDaysInMonth(days);
  };

  const hasEvent = (date) => {
    if (!weekbookings || weekbookings.length === 0) return false;
      return weekbookings.some((event) => {
          console.log(event.date)
        if (event.date) {
      const eventDate = dayjs(event.date); 
      const formattedDate = date.startOf('day'); 
      return eventDate.isSame(formattedDate, 'day');
    }
      return false;
    });
  };

  if (weekbookingsloading) {
    return <div>Carregando...</div>;
  }
  if (weekbookingserror) {
    return <div>Erro ao carregar reservas</div>;
  }
  const weeks = [];
  let week = [];

  daysInMonth.forEach((day, index) => {
    if (day.day() === 0 && index > 0) { 
      weeks.push(week);
      week = [];
    }
    week.push(day);
  });

  if (week.length > 0) {
    weeks.push(week);
  }

  return (
    <div className="p-6 space-y-4">
      <header className="flex justify-between items-center mb-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}
        >
          Anterior
        </button>
        <span className="text-xl uppercase font-semibold">{currentDate.format('MMMM YYYY')}</span>
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setCurrentDate(currentDate.add(1, 'month'))}
        >
          Próximo
        </button>
      </header>

      <div className="text-center grid grid-cols-7 gap-1 mb-4">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div key={day} className="text-[24px] bg-accent px-2 py-2 rounded-lg font-medium text-gray-600 ">
            {day}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {weeks.map((week, index) => (
          <div key={index} className="grid grid-cols-7 gap-2 ">
            {week.map((day) => (
              <div
                key={day.format('YYYY-MM-DD')}
                className={`relative p-2 rounded-md flex justify-center items-center w-[100px] h-[100px] text-center cursor-pointer hover:bg-gray-100 ${
                  hasEvent(day) ? 'bg-green-200' : 'bg-accent'
                }`}
              >
                <span className="block text-[32px]">{day.format('D')}</span>
                {hasEvent(day) && (
                        <div className="absolute top-1 rounded-full right-1 w-8 h-8 text-green-900" >
                            </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
