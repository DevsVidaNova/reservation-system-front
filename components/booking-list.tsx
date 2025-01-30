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
import { Calendar, Clock, MapPin, Phone, User } from 'lucide-react';

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
import Link from "next/link"
import { listBookings } from '@/app/api/booking';
import { getUser } from '@/hooks/user';

export function BookingList() {
    const [user, setuser] = useState();
    const { data: bookings, error, isLoading, refetch } = useQuery({
        queryKey: ['bookings list'],
        queryFn: async () => {
            const res = await listBookings();
            const user = await getUser();
            setuser(user);
            return res;
        },
    });
    const todayDate = new Date().toISOString().split('T')[0];
    const todayBookings = bookings?.filter((booking: Booking) => booking.date === todayDate);
    const currentWeekBookings = bookings ? bookings.filter((booking: Booking) => { const now = new Date(); const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); const endOfWeek = new Date(startOfWeek); endOfWeek.setDate(startOfWeek.getDate() + 6); if (!booking.date) return false; const bookingDate = new Date(booking.date); return bookingDate >= startOfWeek && bookingDate <= endOfWeek; }) : [];
    const myBookings = bookings?.filter((booking: Booking) => booking.user._id === user?.id);

   
    if (isLoading) {
        return <div>Carregando reservas aguarde...</div>
    }
    if (error) {
        return <div>Error: {error.message}</div>
    }
    return (
        <div className='z-1'>
            <Tabs defaultValue="semana" className="w-full">
                <div className='justify-between flex-row flex w-full'>
                    <div className='flex-row flex gap-2 mx-auto'>
                        <TabsList>
                            <TabsTrigger value="hoje" >Hoje</TabsTrigger>
                            <TabsTrigger value="semana" >Semana</TabsTrigger>
                            <TabsTrigger value="tudo" >Tudo</TabsTrigger>
                            <TabsTrigger value="my" className='md:block hidden'>Minhas reservas</TabsTrigger>
                        </TabsList>
                    </div>
                    <div className='md:block hidden'>
                        {user ?
                            <BookingForm refetch={refetch} /> :
                            <Link href="/auth/login">
                                <Button variant="default" >Fazer Reserva</Button>
                            </Link>
                        }
                    </div>
                </div>
                <TabsContent value="hoje">
                    <AvaliableDays data={todayBookings}/>
                </TabsContent>
                <TabsContent value="semana">
                    <AvaliableDays data={currentWeekBookings} />
                </TabsContent>
                <TabsContent value="tudo">
                    <AvaliableDays data={bookings} />
                </TabsContent>
                <TabsContent value="my" >
                    <AvaliableDays data={myBookings} />
                </TabsContent>
            </Tabs>
            <div style={{ height: 150, }}></div>
            <div style={{ position: 'fixed', bottom: 50, left: '50%', transform: 'translateX(-50%)' }} className='justify-center items-center md:hidden'>
                {user ?
                    <BookingForm refetch={refetch} /> :
                    <Link href="/auth/login">
                        <Button variant="default" style={{ flexGrow: 1, padding: '25px 40px', borderRadius: 100 }}>Fazer Reserva</Button>
                    </Link>
                }
            </div>
        </div>
    )
}

const AvaliableDays = ({ data,}: { data: any, }) => {
    if (data?.length === 0) return <div className='flex flex-row items-center gap-6 border-2 p-6 rounded-xl my-6 z-1'>
        <div className='flex flex-col'>
            <h2 className='text-[24px] font-bold text-center' style={{ lineHeight: 1, }}>Não encontramos nenhuma reserva</h2>
            <span className='opacity-70 text-[18px] text-center'>Sem reservas por enquanto...</span>
        </div>
    </div>
    if (!data) return <div>Carregando...</div>
    return (
        <div className='gap-8 z-1'>
            {data?.map((booking: Booking) => {
                const { endTime, startTime, room, user, date, _id, description } = booking
                const [year, month, day] = (date?.split('-') || ['0000', '00', '00']);
                const formattedDate = `${year}-${month}-${day}`;

                const timeStart = new Date(startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                const timeEnd = new Date(endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                const dayOfWeek = new Date(formattedDate).toLocaleDateString('pt-BR', { weekday: 'long' });

                return (
                    <Card key={_id} className="md:p-2 flex-row flex align-center justify-between items-center w-full my-4">
                        <div className='flex flex-row w-[100%]'>
                            <div className='flex-col w-[80px] flex md:px-6 md:py-2 w-[20%] justify-center items-center border-r'>
                                <span className='md:text-[18px]  md:leading-[24px] text-[16px]  leading-[16px] uppercase sm:text-[12px]'>{dayOfWeek.slice(0, 3)}</span>
                                <span className='md:text-[36px] font-bold md:leading-[36px] text-[24px] leading-[24px] font-medium '>{day}</span>
                            </div>
                            <div className='flex-col flex px-4 py-4 gap-2 sm:px-0 sm:py-0  w-[80%]'>
                                <div className='flex-row flex gap-2'>
                                    <div className='flex-row flex gap-2 items-center opacity-70'>
                                        <Clock size={12} />
                                        <span className='text-[12px] md:text-[18px] md:leading-[24px] leading-[12px]'>{timeStart} - {timeEnd}</span>
                                    </div>
                                    <div className='flex-row flex gap-2 items-center opacity-70'>
                                        <User size={12} />
                                        <span className='text-[12px] md:text-[18px] md:leading-[24px] leading-[12px]'>{user?.name.length > 16 ? user?.name.slice(0, 16) + '...' : user?.name}</span>
                                    </div>
                                </div>
                                <div className='flex-row flex gap-2 items-center opacity-70'>
                                    <MapPin size={12} />
                                    <span className='text-[12px] md:text-[18px] md:leading-[24px] leading-[12px]'>{room} - {description?.length > 24 ? description?.slice(0, 21) + '...' : description}</span>
                                </div>
                            </div>
                        </div>

                        <div className='flex-row flex px-2 py-2 align-center items-center border-l flex-none'>
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
                                            href={`https://wa.me/55${user?.phone?.replace(/[()\s-]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center"
                                        >
                                            WhatsApp
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <a href={`tel:+55${user?.phone}`} className="flex items-center">
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
