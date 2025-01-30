"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { editBooking, } from "@/app/api/booking"
import { useQuery } from "@tanstack/react-query"
import { Room } from "@/app/api/types"
import { listRooms } from "@/app/api/rooms"
import { HelpCircle, Pencil, Users } from "lucide-react"
import Link from "next/link"

const formSchema = z.object({
  description: z.string().min(2, {
    message: "A descrição deve ter pelo menos 2 palavras.",
  }),
  room: z.string({
    required_error: "Por favor, selecione uma sala.",
  }),
  date: z.string({
    required_error: "Por favor, selecione uma data.",
  }).refine((val) => val !== null, {
    message: "Por favor, selecione uma data válida.",
  }),
  startTime: z.string().nonempty("Por favor, selecione uma hora de início."),
  endTime: z.string().nonempty("Por favor, selecione uma hora de término."),

})

export function BookingEditForm({ id, refetch, defaultValues }: { id: string, refetch: () => void, defaultValues: any }) {
  const [open, setOpen] = useState(false)

  const { data: rooms, error: errorList, isLoading, } = useQuery<Room[]>({
    queryKey: ['list rooms'],
    queryFn: async () => {
      const res = await listRooms(1);
      return res;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      room: "",
      date: "",
      startTime: "",
      endTime: "",
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
        setsuccess(response.message)
        setTimeout(() => {
          setOpen(false)
          form.reset()
          refetch()
        }, 1500);
      }
    } catch (error: any) {
      seterror(error.message)
    }
  }
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  useEffect(() => {
    if (defaultValues) {
      form.setValue('description', defaultValues.description)
      form.setValue('room', defaultValues.room)
      form.setValue('date', formatDate(defaultValues.date));
      form.setValue('startTime', formatTime(defaultValues.startTime))
      form.setValue('endTime', formatTime(defaultValues.endTime))
    }
  }, [defaultValues])

  const [openCalendar, setOpenCalendar] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild >
        <Button variant='outline' className='w-[38px] h-[42px] rounded-lg'>
          <Pencil size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[455px]">
        <DialogHeader>
          <DialogTitle>Reserva de Sala</DialogTitle>
          <DialogDescription>Preencha os detalhes para fazer sua reserva.</DialogDescription>
        </DialogHeader>
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
                          <div className="w-[62px] h-[60px] border rounded-[4px] items-center justify-center flex-col flex">
                            <HelpCircle size={24} />
                          </div>
                        </Link>
                      </div>
                    </FormControl>
                    <SelectContent >
                      {rooms?.map((room: Room) => {
                        const { _id, name, size, description, exclusive, status, } = room
                        return (
                          <SelectItem value={name}>
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
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9/]/g, ""); // Permite apenas números e "/"
                          const formattedValue = value
                            .replace(/^(\d{2})$/g, "$1/") // Adiciona "/" após o dia
                            .replace(/^(\d{2}\/\d{2})$/g, "$1/"); // Adiciona "/" após o mês
                          if (formattedValue.length <= 10) {
                            field.onChange(formattedValue); // Atualiza o valor apenas se estiver no limite
                          }
                        }}
                        maxLength={10} // Limita o tamanho do input a "dd/mm/yyyy"
                      />
                    </FormControl>

                    <Button type="button" className="w-full rounded-[6px] h-[48px]" onClick={() => setOpenCalendar(!openCalendar)}>
                      {openCalendar ? 'Fechar calendário' : 'Abrir calendário'}
                    </Button>
                  </div>
                  {openCalendar && (
                    <div className="absolute z-10 mt-2 bg-white shadow-md rounded">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            const formattedDate = format(date, "dd/MM/yyyy"); // Formata a data no padrão desejado
                            field.onChange(formattedDate); // Define o valor formatado
                          }
                          setOpenCalendar(false); // Fecha o calendário após seleção
                        }}
                        initialFocus
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
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
                name="endTime"
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
            <DialogFooter>
              <div className="flex flex-col w-full gap-4">
                {error && <div className='bg-red-200 mb-4 py-2 px-4 rounded-md '><p className="text-red-500">{error}</p></div>}
                {success && <div className='bg-green-200 mb-4 py-2 px-4 rounded-md '><p className="text-green-500">{success}</p></div>}
                <Button type="submit" style={{ flexGrow: 1, padding: '25px 40px', borderRadius: 100 }}>Concluir reserva</Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

