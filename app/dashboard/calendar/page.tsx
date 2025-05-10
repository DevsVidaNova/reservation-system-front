'use client';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
dayjs.locale('pt-br');
import { useQuery } from '@tanstack/react-query';
import { listBookings } from '@/app/__api/booking';
import Calendar from '@/components/calendarv2/calendar';
import TodayEventsList from '@/components/calendarv2/today';
import { ListBooking } from '@/app/__api/types';

export default function CalendarPage() {
  const { data: month, error: weekbookingserror, isLoading: weekbookingsloading } = useQuery<ListBooking>({
    queryKey: ['calendar bookings'],
    queryFn: listBookings,
  });

  if (weekbookingsloading) {
    return <div>Carregando...</div>;
  }
  if (weekbookingserror) {
    return <div>Erro ao carregar reservas</div>;
  }
  return (
    <div className="p-6 space-y-4 justify-center items-center">
      <Calendar events={month} />
      <TodayEventsList events={month} />
    </div>
  );
}
