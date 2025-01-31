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
import { BookDashed, Clock, MapPin, Phone, User } from 'lucide-react';
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

    const [myBookings, setmyBookings] = useState([]);
    const [user, setuser] = useState({ id: '', name: '', email: '', isAdmin: false, phone: '' });
    const { data: bookings, error, isLoading, refetch } = useQuery({
        queryKey: ['bookings list'],
        queryFn: async () => {
            const res = await listBookings();
            const user = await getUser();
            const myBookings = res?.filter((booking: any) => booking?.user?._id === user?.id);
            setuser(user);
            setmyBookings(myBookings);
            return res;
        },
    });
    const todayDate = new Date().toISOString().split('T')[0];
    const todayBookings = bookings?.filter((booking: Booking) => booking.date === todayDate);
    const currentWeekBookings = bookings ? bookings.filter((booking: Booking) => { const now = new Date(); const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); const endOfWeek = new Date(startOfWeek); endOfWeek.setDate(startOfWeek.getDate() + 6); if (!booking.date) return false; const bookingDate = new Date(booking.date); return bookingDate >= startOfWeek && bookingDate <= endOfWeek; }) : [];

    if (isLoading) {
        return <div>Carregando reservas aguarde...</div>
    }
    if (error) {
        return <div>Error: {error.message}</div>
    }
    return (
        <div className='z-10 mx-auto'>
            <Tabs defaultValue="semana" className=" w-full">
                <div className='justify-between flex-row flex w-full container'>
                    <div className='flex-row flex gap-2 mx-auto md:mx-0'>
                        <TabsList>
                            <TabsTrigger value="hoje" >Hoje</TabsTrigger>
                            <TabsTrigger value="semana" >Semana</TabsTrigger>
                            <TabsTrigger value="tudo" >Tudo</TabsTrigger>
                            <TabsTrigger value="my" >Minhas reservas</TabsTrigger>
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
                    <AvaliableDays data={todayBookings} />
                </TabsContent>
                <TabsContent value="semana">
                    <AvaliableDays data={currentWeekBookings} />
                </TabsContent>
                <TabsContent value="tudo">
                    <AvaliableDays data={bookings} />
                </TabsContent>
                <TabsContent value="my">
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

const AvaliableDays = ({ data, }: { data: any, }) => {
    if (data?.length === 0) return <div className='flex flex-col items-center border p-6 rounded-xl my-6 self-center'>
        <div className='flex flex-col justify-center items-center gap-2'>
            <BookDashed size={64} />
            <h2 className='text-[24px] font-bold text-center' style={{ lineHeight: 1, }}>Não encontramos nenhuma reserva</h2>
            <span className='opacity-70 text-[18px] text-center'>Sem reservas criadas por enquanto...</span>
        </div>
    </div>
    if (!data) return <div>Carregando...</div>
    return (
        <div className='gap-8 z-0'>
            {data?.map((booking: Booking) => {
                const { endTime, startTime, room, user, date, _id, description } = booking
                const [year, month, day] = (date?.split('-') || ['0000', '00', '00']);
                const formattedDate = `${year}-${month}-${day}`;

                const timeStart = new Date(startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                const timeEnd = new Date(endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                const dayOfWeek = new Date(formattedDate).toLocaleDateString('pt-BR', { weekday: 'long' });
                const monthName = new Date(formattedDate).toLocaleDateString('pt-BR', { month: 'long' });

                return (
                    <div key={_id} className="border rounded-lg flex-row flex justify-between w-full my-4">
                        <div className='flex flex-row w-[100%]'>
                            <div className='flex-col w-[80px] h-full py-3 flex md:px-6 md:py-2 w-[20%] justify-center items-center border-r'>
                                <span className='md:text-[20px] md:leading-[24px] text-[16px] leading-[16px] font-medium uppercase'>{dayOfWeek.slice(0, 3)}</span>
                                <span className='md:text-[36px] md:leading-[32px] text-[24px] leading-[26px] font-bold uppercase'>{day}</span>
                                <span className='md:text-[16px] md:leading-[24px] text-[14px] leading-[14px] uppercase'>{monthName.slice(0, 3)}</span>
                            </div>
                            <div className='flex-col h-[100%] flex px-4 py-4 gap-2 justify-center w-[80%]'>
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
                        <div className='flex flex-col border-l'>
                            <div className='flex-row flex px-4 h-full items-center'>
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
                        </div>

                    </div>
                )
            }
            )}
        </div>

    )
}
