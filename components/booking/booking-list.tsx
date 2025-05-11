
'use client'
import { BookDashed, Clock, MapPin, Phone, User } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Button,
    Skeleton,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui"

import Link from "next/link"

import { useQuery } from '@tanstack/react-query'

import { BookingForm } from './booking-add';
import { ListBooking } from "@/app/__api/types";
import { listBookings, listBookingsWeek, listBookingsMy, listBookingsToday, listBookingsMonth } from '@/app/__api/booking';

import { getUser } from '@/hooks/user';

export function BookingList() {
    const { data: user, error: usererror, isLoading: userloading, } = useQuery({
        queryKey: ['user'],
        queryFn: getUser
    });
    const { data: bookings, error, isLoading, refetch } = useQuery<ListBooking[]>({
        queryKey: ['bookings list'],
        queryFn: listBookings,
    });
    const { data: mybookings, error: mybookingserror, isLoading: mybookingsloading, } = useQuery<ListBooking[]>({
        queryKey: ['my bookings'],
        queryFn: listBookingsMy,
    });
    const { data: month, error: monthbookingserror, isLoading: monthbookingsloading, } = useQuery<ListBooking[]>({
        queryKey: ['month bookings'],
        queryFn: listBookingsMonth,
    });
    const { data: weekbookings, error: weekbookingserror, isLoading: weekbookingsloading, } = useQuery<ListBooking[]>({
        queryKey: ['week bookings'],
        queryFn: listBookingsWeek,
    });
    const { data: todaybookings, error: todaybookingserror, isLoading: todaybookingsloading, } = useQuery<ListBooking[]>({
        queryKey: ['today bookings'],
        queryFn: listBookingsToday,
    });

    return (
        <div className='z-10 mx-auto'>
            <Tabs defaultValue="semana" className=" w-full">
                <div className='justify-between flex-row flex w-full container'>
                    <div className='flex-row flex gap-2 mx-auto md:mx-0'>
                        <TabsList>
                            <TabsTrigger value="semana" >Semana</TabsTrigger>
                            <TabsTrigger value="mes" >Mês</TabsTrigger>
                            <TabsTrigger value="tudo" >Tudo</TabsTrigger>
                            <TabsTrigger value="my" >Minhas reservas</TabsTrigger>
                        </TabsList>
                    </div>
                    <div className='md:block hidden '>
                        {user ?
                            <BookingForm refetch={refetch} /> :
                            <Link href="/auth/login">
                                <Button  >Fazer Reserva</Button>
                            </Link>
                        }
                    </div>
                </div>
                <TabsContent value="hoje">
                    <BookingItem data={todaybookings || []} />
                </TabsContent>
                <TabsContent value="semana">
                    {weekbookingsloading ? <SkeletonBookings /> : <BookingItem data={weekbookings || []} />}
                </TabsContent>
                <TabsContent value="mes">
                    <BookingItem data={month || []} />
                </TabsContent>
                <TabsContent value="tudo">
                    <BookingItem data={bookings || []} />
                </TabsContent>
                <TabsContent value="my">
                    <BookingItem data={mybookings || []} />
                </TabsContent>
            </Tabs>
            <div style={{ height: 150, }}></div>
            <div style={{ position: 'fixed', bottom: 50, left: '50%', transform: 'translateX(-50%)' }} className='justify-center items-center md:hidden'>
                {user ?
                    <BookingForm refetch={refetch} /> :
                    <Link href="/auth/login">
                        <Button>Fazer Reserva</Button>
                    </Link>
                }
            </div>
        </div>
    )
}

const BookingItem = ({ data }: { data: ListBooking[], }) => {
    if (data?.length === 0) return <div className='flex flex-col items-center border p-6 rounded-xl my-6 self-center'>
        <div className='flex flex-col justify-center items-center gap-2'>
            <BookDashed size={64} />
            <h2 className='text-[24px] font-bold text-center' style={{ lineHeight: 1, }}>Não encontramos nenhuma reserva</h2>
            <span className='opacity-70 text-[18px] text-center'>Sem reservas criadas por enquanto...</span>
        </div>
    </div>
    return (
        <div className='gap-8 z-0'>
            {data?.map((booking: ListBooking) => {
                const { end_time, start_time, room, user, date, id, description, repeat, day_repeat, day_of_week, month } = booking;
                const repeats = [{ id: 'day', name: 'DIA' }, { id: 'week', name: 'SEM' }, { id: 'month', name: 'MÊS' }];
                const repeatName = repeats.find((r) => r.id === repeat)?.name;

                return (
                    <div key={id} className="border rounded-lg flex-row flex justify-between w-full my-4">
                        <div className='flex flex-row w-[100%]'>
                            <div className='flex-col w-[80px] h-full py-3 flex md:px-6 md:py-2 justify-center items-center border-r'>
                                <span className='md:text-[20px] md:leading-[24px] text-[16px] leading-[16px] font-medium uppercase'>{day_of_week || day_repeat}</span>
                                <span className='md:text-[36px] md:leading-[32px] text-[24px] leading-[26px] font-bold uppercase'>{date ? date?.slice(0, 2) : '↻'}</span>
                                <span className='md:text-[16px] md:leading-[24px] text-[14px] leading-[14px] uppercase'>{month ? month : repeatName}</span>
                            </div>
                            <div className='flex-col h-[100%] flex px-4 py-4 gap-2 justify-center w-[80%]'>
                                <div className='flex-row flex gap-2'>
                                    <div className='flex-row flex gap-2 items-center opacity-70'>
                                        <Clock size={12} />
                                        <span className='text-[12px] md:text-[18px] md:leading-[24px] leading-[12px]'>{start_time} - {end_time}</span>
                                    </div>
                                    <div className='flex-row flex gap-2 items-center opacity-70'>
                                        <User size={12} />
                                        <span className='text-[12px] md:text-[18px] md:leading-[24px] leading-[12px]'>{user?.name.length > 16 ? user?.name.slice(0, 16) + '...' : user?.name}</span>
                                    </div>
                                </div>
                                <div className='flex-row flex gap-2 items-center opacity-70'>
                                    <MapPin size={12} />
                                    <span className='text-[12px] md:text-[18px] md:leading-[24px] leading-[12px]'>{room.name} - {description?.length > 24 ? description?.slice(0, 21) + '...' : description}</span>
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

const SkeletonBookings = () => {
    return (
        <div className='gap-8 z-0'>
            {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="border rounded-lg flex-row flex justify-between w-full my-4">
                    <div className='flex flex-row w-[100%]'>
                        <div className='flex-col gap-2 w-[80px] h-full py-3 px-3 flex md:px-3 md:py-2  justify-center items-center border-r'>
                            <Skeleton className='h-20 w-full' />
                        </div>
                        <div className='flex-col h-[100%] flex px-4 py-4 gap-2 justify-center w-[80%]'>
                            <div className='flex-col flex gap-4 justify-center'>
                                <div className='flex-row flex gap-4 '>
                                    <Skeleton className='h-8 w-[40%]' />
                                    <Skeleton className='h-8 w-[60%]' />
                                </div>
                                <div className='flex-row flex'>
                                    <Skeleton className='h-6 w-full' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col border-l'>
                        <div className='flex-row flex px-4 h-full items-center'>
                            <Skeleton className='h-12 w-12 rounded-full' />
                        </div>
                    </div>
                </div>))}
        </div>
    )

}
