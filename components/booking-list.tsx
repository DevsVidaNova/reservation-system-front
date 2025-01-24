'use client'
import { useState } from 'react';
import { Card } from "./ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Booking } from "./types";
import { Calendar, Clock, MapPin, Phone } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useQuery } from '@tanstack/react-query'
import { BookingForm } from './booking-form';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function BookingList() {
    const { data: bookings, error, isLoading, refetch } = useQuery({
        queryKey: ['bookings'],
        queryFn: async () => {
            const res = await fetch("https://backagenda.onrender.com/bookings");
            return res.json();
        },
    });
    const [local, setLocal] = useState(false);
    const [selectData, setselectData] = useState('25/01/2025');
    const [selectLocate, setselectLocate] = useState();

    const todayDate = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: '2-digit', year: 'numeric' }).split('/').join('/');
    //FILTERS 
    const todayBookings = bookings?.filter((booking: Booking) => booking.date === todayDate);
    const selectBookings = bookings?.filter((booking: Booking) => booking.date === selectData);
    const currentWeekBookings = bookings?.filter((booking: Booking) => { const now = new Date(), startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())), endOfWeek = new Date(startOfWeek); endOfWeek.setDate(startOfWeek.getDate() + 6); const [day, month, year] = booking.date.split('/').map(Number); const bookingDate = new Date(year, month - 1, day); return bookingDate >= startOfWeek && bookingDate <= endOfWeek; });
    const locateBookings = bookings?.filter((booking: Booking) => booking.room === selectLocate);

    if (isLoading) {
        return <div>Carregando reservas aguarde...</div>
    }
    if (error) {
        return <div>Error: {error.message}</div>
    }
    return (
        <div>
            <Tabs defaultValue="semana" className="w-full">
                <div className='justify-between flex-row flex w-full'>
                    <div className='flex-row flex gap-2'>
                        <TabsList>
                            <TabsTrigger value="hoje" onClick={() => { setLocal(false) }}>Para hoje</TabsTrigger>
                            <TabsTrigger value="semana" onClick={() => { setLocal(false) }}>Esta semana</TabsTrigger>
                            <TabsTrigger value="tudo" onClick={() => { setLocal(false) }}>Tudo</TabsTrigger>
                            <TabsTrigger className='md:block hidden' value="local" onClick={() => { setLocal(true) }}>Por sala</TabsTrigger>
                        </TabsList>
                        {local &&
                            <div>
                                <Select onValueChange={(value: any) => setselectLocate(value)} >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma sala" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Estúdio">Estúdio</SelectItem>
                                        <SelectItem value="Espaço Multiuso">Espaço Multiuso</SelectItem>
                                        <SelectItem value="Sala de aula - 1">Sala de aula - 1</SelectItem>
                                        <SelectItem value="Sala de aula - 2">Sala de aula - 2</SelectItem>
                                        <SelectItem value="Sala de aula - 3">Sala de aula - 3</SelectItem>
                                        <SelectItem value="Cozinha">Cozinha</SelectItem>
                                        <SelectItem value="Templo">Templo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>}
                    </div>
                    <div className='md:block hidden'>
                        <BookingForm refetch={refetch} />
                    </div>
                </div>
                <TabsContent value="hoje">
                    <AvaliableDays data={todayBookings} />
                </TabsContent>
                <TabsContent value="semana">
                    <AvaliableDays data={currentWeekBookings} />
                </TabsContent>
                <TabsContent value="tudo">
                    <AvaliableDays data={bookings} />
                </TabsContent>
                <TabsContent value="local">
                    <AvaliableDays data={locateBookings} />
                </TabsContent>
            </Tabs>

            <div style={{ position: 'fixed', bottom: 50, left: '50%', transform: 'translateX(-50%)' }} className='justify-center items-center md:hidden'>
                <BookingForm refetch={refetch} />
            </div>
        </div>
    )
}

const AvaliableDays = (data: any) => {
    if (data?.data?.length === 0) return <div className='flex flex-row items-center gap-6 border-2 p-6 rounded-xl my-6'>
        <div className='hidden md:block'>
            <div className='w-[124px] h-[124px] bg-gray-200 flex-col justify-center items-center rounded-full flex'>
                <Calendar size={46} />
            </div>
        </div>
        <div className='flex flex-col'>
            <h2 className='text-[24px]  font-bold' style={{ lineHeight: 1, }}>Não encontramos nenhuma reserva</h2>
            <span className='opacity-70 text-[18px]'>Sem reservas por enquanto...</span>
        </div>
    </div>
    if (!data) return <div>Carregando...</div>
    return (
        <div className='gap-8'>
            {data.data.map((booking: Booking) => {
                const { endTime, startTime, phone, room, name, date } = booking
                const colorsAvatar = [
                    { text: '#fff', bg: '#AF34BF' },
                    { text: '#fff', bg: '#DA541E' },
                    { text: '#000', bg: '#F2BE22' },
                    { text: '#fff', bg: '#1B21A6' },
                    { text: '#fff', bg: '#FF5733' },
                    { text: '#FFF', bg: '#32a881' },
                    { text: '#fff', bg: '#900C3F' },
                    { text: '#fff', bg: '#6fd1b1' },
                    { text: '#000', bg: '#dd88e3' },
                    { text: '#000', bg: '#d8e388' },
                    { text: '#fff', bg: '#9da1ed' },
                    { text: '#fff', bg: '#ed9db0' },
                ]
                const randomColor = colorsAvatar[Math.floor(Math.random() * colorsAvatar.length)];
                const [day, month, year] = date.split('/');
                const formattedDate = `${year}-${month}-${day}`;
                const dayOfWeek = new Date(formattedDate).toLocaleDateString('pt-BR', { weekday: 'long' });

                return (
                    <Card className="p-2 flex-row flex align-center justify-between items-center w-full my-4">
                        <div className='flex-col flex px-6 py-2 justify-center items-center border-r-2'>
                            <span className='text-[18px] leading-[24px] uppercase'>{dayOfWeek.slice(0, 3)}</span>
                            <span className='text-[36px] leading-[36px] font-medium'>{day}</span>
                        </div>

                        <div className='flex-col flex px-2 py-4 gap-2 '>
                            <div className='flex-row flex gap-2 items-center'>
                                <Clock size={18} />
                                <span className='text-[18px] leading-[24px]'>{startTime} - {endTime}</span>
                            </div>
                            <div className='flex-row flex gap-2 items-center'>
                                <MapPin size={18} />
                                <span className='text-[18px] leading-[24px]'>{room}</span>
                            </div>
                        </div>


                        <div className='flex-row flex px-4 py-4 gap-4 align-center items-center border-l-2'>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div style={{ backgroundColor: randomColor?.bg, width: 46, height: 46, justifyContent: 'center', alignItems: 'center', borderRadius: 100, flexDirection: 'column', display: 'flex' }}>
                                            <span style={{ color: randomColor?.text, }} className='font-bold'>{name.split(' ').map((n: string) => n[0]).join('')}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <span>{name}</span>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-12 w-12">
                                        <Phone className="h-16 w-16" />
                                        <span className="sr-only">Abrir menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Contato</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <a
                                            href={`https://wa.me/55${phone.replace(/[()\s-]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center"
                                        >
                                            WhatsApp
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <a href={`tel:+55${phone}`} className="flex items-center">
                                            Ligar
                                        </a>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </Card >
                )
            }
            )}
        </div>

    )
}
/*
<div className='p-2 items-center'>
<span className='text-[18px] font-semibold'>Sobre</span>
<p className='text-[14px] opacity-70'>Descrição</p>
</div>
*/