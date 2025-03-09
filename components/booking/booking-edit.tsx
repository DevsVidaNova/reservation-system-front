"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"

import {
  Calendar,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Input,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
  Button, Message
} from "@/components/ui"


import { editBooking, } from "@/app/__api/booking"
import { useQuery } from "@tanstack/react-query"
import { listRooms } from "@/app/__api/rooms"

import { CalendarSearch, CalendarX2, HelpCircle, Pencil, Users } from "lucide-react"
import Link from "next/link"
import { ListRoom } from "../../app/__api/types"

const formSchema = z
  .object({
    description: z.string({
      required_error: "Por favor, insira uma descrição.",
    }).min(2, {
      message: "A descrição deve ter pelo menos 2 palavras.",
    }),
    room: z.string({
      required_error: "Por favor, selecione uma sala.",
    }),
    start_time: z.string({
      required_error: "Por favor, insira a hora de início.",
    }),
    end_time: z.string({
      required_error: "Por favor, insira a hora de término",
    }),
    date: z.string().optional().nullable(),
    repeat: z.string().optional(),
    day_repeat: z.string().optional(),
  })
  .refine(
    (data) => data.day_repeat || (data.date && typeof data.date === 'string' && data.date.length === 10),
    {
      message: "Informe uma data válida ou escolha um intervalo de repetição.",
      path: ["date"],
    }
  );


const repeats = [
  { id: 'null', name: 'Nenhum dia', },
  { id: 'day', name: 'Diariamente', },
  { id: 'week', name: 'Semanalmente', },
  { id: 'month', name: 'Mensalmente', }
];

const days = [
  { id: '0', name: 'Domingo', },
  { id: '1', name: 'Segunda', },
  { id: '2', name: 'Terça', },
  { id: '3', name: 'Quarta', },
  { id: '4', name: 'Quinta', },
  { id: '5', name: 'Sexta', },
  { id: '6', name: 'Sábado', }
];

export function BookingEditForm({ id, refetch, defaultValues }: { id: any, refetch: () => void, defaultValues: any }) {
  const [open, setOpen] = useState(false)

  const { data: rooms, error: errorList, isLoading, } = useQuery<ListRoom[]>({
    queryKey: ['list rooms'],
    queryFn: listRooms
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: defaultValues.description,
      room: defaultValues.room.id,
      date: defaultValues?.date ? defaultValues.date : null,
      start_time: defaultValues.start_time,
      end_time: defaultValues.end_time,
      repeat: defaultValues.repeat ? defaultValues.repeat : 'null',
      day_repeat: days.find((day) => day.name.slice(0, 3) === defaultValues.repeat_day)?.id,
    },
  })
  const [success, setsuccess] = useState('');
  const [error, seterror] = useState('');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setsuccess('')
    seterror('')
    try {
      const response = await editBooking(id, values)
      if (response) {
        setsuccess('Reserva editada com sucesso!')
        refetch()
      }
    } catch (error: any) {
      seterror(error.message)
    }
  }
  const hasRepeat = form.watch("repeat");

  const [openCalendar, setOpenCalendar] = useState(false);

  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild >
          <Button variant='outline' className='w-[46px] h-[46px] rounded-full'>
            <Pencil size={24} />
          </Button>
        </DrawerTrigger>
        <DrawerContent >

          <div className="container mx-auto px-4">
            <DrawerHeader>
              <DrawerTitle>Reserva de Sala</DrawerTitle>
              <DrawerDescription>Preencha os detalhes para fazer sua reserva.</DrawerDescription>
            </DrawerHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input placeholder="Descrição da reserva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="room"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sala</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} >
                        <FormControl>
                          <div className="flex-row flex gap-2">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma sala" />
                            </SelectTrigger>
                            <Link href="/gallery">
                              <div className="w-[52px] h-[48px] border rounded-[4px] items-center justify-center flex-col flex">
                                <HelpCircle size={24} />
                              </div>
                            </Link>
                          </div>
                        </FormControl>
                        <SelectContent >
                          {rooms?.map((room: ListRoom) => {
                            const { id, name, size, description, exclusive, status, } = room
                            return (
                              <SelectItem value={id} key={id}>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-[14px]">
                                    {name} {exclusive ? " (Exclusiva)" : ""}
                                  </span>
                                </div>
                                <div className="flex flex-row items-center gap-2 opacity-60">
                                  <Users size={14} /> {size} pessoas
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data</FormLabel>
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="dd/mm/yyyy"
                              value={field.value || ""}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, "");
                                if (value.length > 8) return;

                                if (value.length > 4) value = value.replace(/^(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
                                else if (value.length > 2) value = value.replace(/^(\d{2})(\d{0,2})/, "$1/$2");

                                field.onChange(value);
                              }}
                              maxLength={10}
                            />
                          </FormControl>

                          <Button type="button" className={`w-[48px] rounded-[6px] h-[48px]`} onClick={() => setOpenCalendar(!openCalendar)}>
                            {openCalendar ? <CalendarX2 /> : <CalendarSearch />}
                          </Button>
                        </div>
                        {openCalendar && (
                          <div className="absolute z-10 -left-[86px] top-[300px] bg-white shadow-md rounded">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  const formattedDate = format(date, "dd/MM/yyyy");
                                  field.onChange(formattedDate);
                                }
                                setOpenCalendar(false);
                              }}
                              initialFocus
                            />
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="repeat"
                    render={({ field }) => (
                      <FormItem >
                        <div className="mb-2">
                          <FormLabel>Repetir</FormLabel>
                        </div>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);

                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-[48px]">
                              <SelectValue defaultChecked placeholder="Nenhum dia" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent >
                            {repeats?.map((repeat: { id: string, name: string }) => {
                              const { id, name, } = repeat
                              return (
                                <SelectItem value={id} key={id}>
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-[14px]">
                                      {name}
                                    </span>
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                </div>
                {hasRepeat != 'null' && (
                  <FormField
                    control={form.control}
                    name="day_repeat"
                    render={({ field }) => (
                      <FormItem >
                        <div style={{ marginBottom: 6, marginTop: -6 }}>
                          <FormLabel >Qual dia deve se repetir? </FormLabel>
                        </div>
                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                          <FormControl>
                            <SelectTrigger className="h-[48px]" >
                              <SelectValue placeholder="Segunda" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent >
                            {days?.map((repeat: any) => {
                              const { id, name, } = repeat
                              return (
                                <SelectItem value={id} key={id}>
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-[14px]">
                                      {name}
                                    </span>
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora Início</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="end_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora Final</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DrawerFooter>
                  <div className="flex flex-col w-full gap-4">
                    <Message success={success} error={error} />
                    <Button>
                      <button type="submit" style={{ flexGrow: 1, padding: '25px 40px', borderRadius: 100 }}>Salvar reserva</button>
                    </Button>
                    <DrawerClose>
                      <Button variant="secondary" className="w-full">Fechar</Button>
                    </DrawerClose>
                  </div>
                </DrawerFooter>
              </form>
            </Form>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

