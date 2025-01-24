'use client'
import { useEffect, useState } from 'react';
import { Card } from "./ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Booking } from "./types";
import { Clock, MapPin, Phone } from 'lucide-react';
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

export function BookingList() {
    const { data: bookings, error, isLoading } = useQuery({
        queryKey: ['bookings'],
        queryFn: async () => {
            const res = await fetch("https://backagenda.onrender.com/bookings");
            return res.json();
        }
    });

    if (isLoading) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>Error: {error.message}</div>
    }

    return (
        <div>
            <Tabs defaultValue="reservas" className="w-full">
                <div className='justify-between flex-row flex w-full'>
                    <TabsList>
                            <TabsTrigger value="reservas">Reservas</TabsTrigger>
                    </TabsList>
                    <BookingForm />
                </div>
                <TabsContent value="reservas">
                    <AvaliableDays data={bookings} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

const AvaliableDays = (data: any) => {
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
                const dayNumber = new Date(formattedDate).getDate();

                return (
                    <Card className="p-2 flex-row flex align-center justify-between items-center w-full my-4">
                        <div className='flex-row flex'>
                            <div className='flex-col flex px-6 py-2 justify-center items-center border-r-2'>
                                <span className='text-[18px] leading-[24px] uppercase'>{dayOfWeek.slice(0,3)}</span>
                                <span className='text-[36px] leading-[36px] font-medium'>{dayNumber}</span>
                            </div>

                            <div className='flex-col flex px-4 py-4 gap-2 border-r-2'>
                                <div className='flex-row flex gap-2 items-center'>
                                    <Clock size={18} />
                                    <span className='text-[18px] leading-[24px]'>{startTime} - {endTime}</span>
                                </div>
                                <div className='flex-row flex gap-2 items-center'>
                                    <MapPin size={18} />
                                    <span className='text-[18px] leading-[24px]'>{room}</span>
                                </div>
                            </div>
                        </div>

                        <div className='p-2 items-center'>
                            <span className='text-[18px] font-semibold'>Sobre</span>
                            <p className='text-[14px] opacity-70'>Descrição</p>
                        </div>
                        <div className='flex-row flex px-4 py-4 gap-4 align-center items-center'>


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