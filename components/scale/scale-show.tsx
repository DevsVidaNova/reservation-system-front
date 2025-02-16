"use client"
import { useState } from "react"

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    Button,
    Message,
} from "@/components/ui"

import { useQuery } from "@tanstack/react-query"

import { CalendarSearch, CalendarX2, } from "lucide-react"

import { SingleScale } from "@/app/__api/types"
import { confirmScale, singleScale } from "@/app/__api/scale"


export function ScaleShow({ id }: { id: string }) {

    const { data: scale, error: errorUsers, isLoading, } = useQuery<SingleScale>({
        queryKey: ['single scale', id],
        queryFn: () => singleScale(id)
    });

    const [success, setsuccess] = useState('');
    const [error, seterror] = useState('');

    const { date, band, projection, light, transmission, camera, live, sound, training_sound, photography, stories, dynamic, direction, name, scale_confirmations, percentage_confirmed } = scale || {};

    return (
        <div>
            <Drawer>
                <DrawerTrigger asChild >
                    <Button variant="ghost" className="bg-amber-500/20 z-20  w-full text-amber-500 hover:bg-amber-100 hover:text-amber-500 rounded-[8px]">Ver mais</Button>
                </DrawerTrigger>
                <DrawerContent >
                    <div className="container mx-auto px-4">
                        <DrawerHeader>
                            <DrawerTitle>Detalhes da escala</DrawerTitle>
                            <DrawerDescription>Tudo o que você precisa saber dessa escala</DrawerDescription>
                        </DrawerHeader>

                        <DrawerFooter>
                            <div className="flex flex-col w-full gap-4">
                                <Message success={success} error={error} />
                                <Button>
                                    <button type="submit" >Confirmar presença</button>
                                </Button>
                                <DrawerClose>
                                    <Button variant="secondary" className="w-full">Fechar</Button>
                                </DrawerClose>
                            </div>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

