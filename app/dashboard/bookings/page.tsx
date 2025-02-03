'use client'
import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Booking } from "@/app/api/types";
import { Clock, MapPin, Phone, Trash, User, EllipsisVertical, BookDashed } from 'lucide-react';
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
import { BookingForm } from '@/components/booking/booking-form';
import { deleteBooking, listBookings } from '@/app/api/booking';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { BookingEditForm } from "@/components/booking/booking-edit";
import { getUser } from "@/hooks/user";

export default function BookingsPage() {
    const [myBookings, setmyBookings] = useState([]);

    const { data: bookings, error, isLoading, refetch } = useQuery({
        queryKey: ['bookings list'],
        queryFn: async () => {
            const res = await listBookings();
            const user = await getUser();
            const myBookings = res?.filter((booking: any) => booking?.user?._id === user?.id);
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
        <div className="z-0 mx-auto py-6 container mx-auto">
            <Tabs defaultValue="semana" className="w-full px-3">
                <div className='justify-between flex-row flex w-full'>
                    <div className='flex-row flex gap-2 mx-auto md:mx-1'>
                        <TabsList>
                            <TabsTrigger value="hoje" >Hoje</TabsTrigger>
                            <TabsTrigger value="semana" >Semana</TabsTrigger>
                            <TabsTrigger value="tudo" >Tudo</TabsTrigger>
                            <TabsTrigger value="my" >Minhas reservas</TabsTrigger>
                        </TabsList>
                    </div>
                    <div className="md:block hidden">
                            <BookingForm refetch={refetch} />
                        </div>
                </div>
                <TabsContent value="hoje">
                    <AvaliableDays data={todayBookings} refetch={refetch} />
                </TabsContent>
                <TabsContent value="semana">
                    <AvaliableDays data={currentWeekBookings} refetch={refetch} />
                </TabsContent>
                <TabsContent value="tudo">
                    <AvaliableDays data={bookings} refetch={refetch} />
                </TabsContent>
                <TabsContent value="my">
                    <AvaliableDays data={myBookings} refetch={refetch} />
                </TabsContent>
            </Tabs>
            <div style={{ height: 150, }}></div>
            <div style={{ position: 'fixed', bottom: 50, left: '50%', transform: 'translateX(-50%)' }} className='justify-center items-center md:hidden'>
                <BookingForm refetch={refetch} />
            </div>
        </div>
    )
}

const AvaliableDays = ({ data, refetch, }: { data: any, refetch: () => void, }) => {
    if (data?.length === 0) return <div className='flex flex-row items-center gap-6 border p-6 justify-center rounded-xl my-6'>
         <div className='flex flex-col justify-center items-center gap-2'>
            <BookDashed size={64} />
            <h2 className='text-[24px] font-bold text-center' style={{ lineHeight: 1, }}>Não encontramos nenhuma reserva</h2>
            <span className='opacity-70 text-[18px] text-center'>Sem reservas criadas por enquanto...</span>
        </div>
    </div>
    const handleExcludeBooking = async (id: string) => {
        try {
            await deleteBooking(id);
            refetch()
        } catch (error) {
            console.log(error)
        }
    }
    if (!data) return <div>Carregando...</div>
    return (
        <div className='gap-8'>
            {data?.map((booking: Booking) => {
                const { endTime, startTime, room, user, date, _id, description } = booking
                const [year, month, day] = (date?.split('-') || ['0000', '00', '00']);
                const formattedDate = `${year}-${month}-${day}`;
                const timeStart = new Date(startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                const timeEnd = new Date(endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                const dayOfWeek = new Date(formattedDate).toLocaleDateString('pt-BR', { weekday: 'long' });
                const monthName = new Date(formattedDate).toLocaleDateString('pt-BR', { month: 'long' });
                return (
                    <Card key={_id} className="md:p-2 p-0 flex-row flex align-center justify-between items-center w-full my-4">
                        <div className='flex flex-row items-center gap-2'>
                            <div className='flex-col w-[80px] flex md:px-6 md:py-2 px-4 py-2 justify-center items-center border-r-2 '>
                                <span className='md:text-[18px]  md:leading-none text-[16px]  leading-[16px] uppercase sm:text-[12px]'>{dayOfWeek.slice(0, 3)}</span>
                                <span className='md:text-[36px] font-bold md:leading-[36px] text-[24px] leading-[24px] font-medium '>{day}</span>
                                <span className='md:text-[18px]  md:leading-[24px] text-[16px]  leading-[16px] uppercase sm:text-[12px]'>{monthName.slice(0,3)}</span>
                            </div>
                            <div className='flex-col flex px-2 py-4 gap-2 sm:px-0 sm:py-0'>
                                <div className='flex-row flex gap-2'>
                                    <div className='flex-row flex gap-2 items-center'>
                                        <Clock size={16} />
                                        <span className='text-[12px] md:text-[18px] md:leading-[24px] leading-[12px] opacity-70'>{timeStart} - {timeEnd}</span>
                                    </div>
                                    <div className='flex-row flex gap-2 items-center'>
                                        <User size={16} />
                                        <span className='text-[12px] md:text-[18px] md:leading-[24px] leading-[12px] opacity-70'>{user?.name.length > 16 ? user?.name.slice(0, 16) + '...' : user?.name}</span>
                                    </div>
                                </div>
                                <div className='flex-row flex gap-2 items-center'>
                                    <MapPin size={16} />
                                    <span className='text-[12px] md:text-[18px] md:leading-[24px] leading-[12px] opacity-70'>{room} - {description?.length > 24 ? description?.slice(0, 21) + '...' : description}</span>
                                </div>
                            </div>
                        </div>

                        <div className='flex-row flex px-4 py-4 ml-2 align-center items-center border-l-2  md:block hidden'>
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
                            <Button variant="outline" className="h-12 w-12 mx-2" onClick={() => handleExcludeBooking(_id)}>
                                <Trash className="h-16 w-16" />
                            </Button>
                            <BookingEditForm id={_id} refetch={refetch} defaultValues={booking} />
                        </div>

                        <div className='block md:hidden border w-[46px] mr-2 h-[46px] rounded-lg items-center justify-center flex'>
                            <Popover>
                                <PopoverTrigger>
                                    <EllipsisVertical size={24} />
                                </PopoverTrigger>
                                <PopoverContent className='w-[204px] mr-4'>
                                    <div className='gap-2 flex flex-row items-center justify-center'>
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
                                        <Button variant="outline" className="h-12 w-12" onClick={() => handleExcludeBooking(_id)}>
                                            <Trash className="h-16 w-16" />
                                        </Button>
                                        <BookingEditForm id={_id} refetch={refetch} defaultValues={booking} />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </Card >
                )
            }
            )}
        </div>

    )
}