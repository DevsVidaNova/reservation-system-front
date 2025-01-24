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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQuery } from '@tanstack/react-query'

export function BookingList() {
    const { data: bookings, error, isLoading } = useQuery({
        queryKey: ['bookings'],
        queryFn: () => {
            fetch("https://backagenda.onrender.com/bookings").then((res) => res.json())
        }
    });

    if (isLoading) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>Error: {error.message}</div>
    }

    const colorsAvatar = [
        { text: '#fff', bg: '#AF34BF' },
        { text: '#fff', bg: '#DA541E' },
        { text: '#000', bg: '#F2BE22' },
        { text: '#fff', bg: '#1B21A6' }
    ]
    const randomColor = colorsAvatar[Math.floor(Math.random() * colorsAvatar.length)];
    
    return (
        <div>
            <Tabs defaultValue="account" className="w-[400px]">
                <TabsList>
                    <TabsTrigger value="account">Reservas</TabsTrigger>
                    <TabsTrigger value="password">Dias disponíveis</TabsTrigger>
                </TabsList>
                <TabsContent value="account">Make changes to your account here.</TabsContent>
                <TabsContent value="password">Change your password here.</TabsContent>
            </Tabs>

            <Card className="p-2 flex-row flex align-center justify-between">
                <div className='flex-row flex'>
                    <div className='flex-col flex px-6 py-2 justify-center items-center border-r-2'>
                        <span className='text-[18px] leading-[24px]'>TER</span>
                        <span className='text-[36px] leading-[36px] font-medium'>28</span>
                    </div>

                    <div className='flex-col flex px-4 py-4 gap-2'>
                        <div className='flex-row flex gap-2 items-center'>
                            <Clock size={18} />
                            <span className='text-[18px] leading-[24px]'>09:00 - 10:00</span>
                        </div>
                        <div className='flex-row flex gap-2 items-center'>
                            <MapPin size={18} />
                            <span className='text-[18px] leading-[24px]'>Templo</span>
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
                                    <span style={{ color: randomColor?.text, fontSize: 18 }}>JS</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>João Sousa</span>
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
                                    href={`https://wa.me/+551234`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center"
                                >
                                    WhatsApp
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <a href={`tel:123`} className="flex items-center">
                                    Ligar
                                </a>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </Card>

        </div>
    )
}