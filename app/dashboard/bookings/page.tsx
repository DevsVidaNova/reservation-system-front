'use client'
import { Card } from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Booking } from "@/app/api/types";
import { Calendar, Clock, MapPin, Phone, Trash, User } from 'lucide-react';

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
import { BookingForm } from '@/components/booking-form';
import { deleteBooking, listBookings } from '@/app/api/booking';

export default function BookingsPage() {
    const { data: bookings, error, isLoading, refetch } = useQuery({
        queryKey: ['bookings list'],
        queryFn: async () => {
            const res = await listBookings();
            return res;
        },
    });
    const todayDate = new Date().toISOString().split('T')[0];
    const todayBookings = bookings?.filter((booking: Booking) => booking.date === todayDate);
    const currentWeekBookings = bookings ? bookings.filter((booking: Booking) => { const now = new Date(); const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); const endOfWeek = new Date(startOfWeek); endOfWeek.setDate(startOfWeek.getDate() + 6); if (!booking.date) return false; const bookingDate = new Date(booking.date); return bookingDate >= startOfWeek && bookingDate <= endOfWeek; }) : [];
    //  const myBookings = bookings?.filter((booking: Booking) => booking.user._id === user?.id);
    //  <TabsTrigger value="my" >Minhas reservas</TabsTrigger>
    //  <TabsContent value="my">
    //  <AvaliableDays data={myBookings} refetch={refetch}   />
    //  </TabsContent>

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
                            <TabsTrigger value="hoje" >Para hoje</TabsTrigger>
                            <TabsTrigger value="semana" >Esta semana</TabsTrigger>
                            <TabsTrigger value="tudo" >Tudo</TabsTrigger>
                        </TabsList>
                        <BookingForm refetch={refetch} /> :
                    </div>
                </div>
                <TabsContent value="hoje">
                    <AvaliableDays data={todayBookings} refetch={refetch}  />
                </TabsContent>
                <TabsContent value="semana">
                    <AvaliableDays data={currentWeekBookings} refetch={refetch}   />
                </TabsContent>
                <TabsContent value="tudo">
                    <AvaliableDays data={bookings} refetch={refetch}  />
                </TabsContent>
               
            </Tabs >
            <div style={{ height: 150, }}></div>

            <div style={{ position: 'fixed', bottom: 50, left: '50%', transform: 'translateX(-50%)' }} className='justify-center items-center md:hidden'>
                <BookingForm refetch={refetch} />  
            </div>
        </div >
    )

}

const AvaliableDays = ({ data, refetch, }: { data: any, refetch: () => void,  }) => {

    if (data?.length === 0) return <div className='flex flex-row items-center gap-6 border-2 p-6 rounded-xl my-6'>
        <div className='hidden md:block'>
            <div className='w-[124px] h-[124px] bg-primary flex-col justify-center items-center rounded-full flex'>
                <Calendar size={46} />
            </div>
        </div>
        <div className='flex flex-col'>
            <h2 className='text-[24px]  font-bold' style={{ lineHeight: 1, }}>Não encontramos nenhuma reserva</h2>
            <span className='opacity-70 text-[18px]'>Sem reservas por enquanto...</span>
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

                return (
                    <Card key={_id} className="md:p-2 p-0 flex-row flex align-center justify-between items-center w-full my-4">
                        <div className='flex flex-row items-center gap-2'>
                            <div className='flex-col w-[80px] flex md:px-6 md:py-2 px-4 py-2 justify-center items-center border-r-2'>
                                <span className='md:text-[18px]  md:leading-[24px] text-[16px]  leading-[16px] uppercase sm:text-[12px]'>{dayOfWeek.slice(0, 3)}</span>
                                <span className='md:text-[36px] font-bold md:leading-[36px] text-[24px] leading-[24px] font-medium '>{day}</span>
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

                        <div className='flex-row flex px-4 py-4 gap-4 align-center items-center border-l-2'>
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
                        </div>
                    </Card >
                )
            }
            )}
        </div>

    )
}