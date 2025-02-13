"use client"
import { useState } from "react"
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
import { addBooking, } from "@/app/api/booking"
import { useQuery } from "@tanstack/react-query"
import { Room } from "@/app/api/types"
import { listRooms } from "@/app/api/rooms"
import { CalendarSearch, CalendarX2, HelpCircle, Users } from "lucide-react"
import Link from "next/link"


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
    date: z.string().optional(),
    startTime: z.string(),
    endTime: z.string(),
    repeat: z.string(),
    dayRepeat: z.string().optional(),
  })
  .refine(
    (data) => data.dayRepeat || (data.date && data.date.length === 10),
    {
      message: "Informe uma data válida ou escolha um intervalo de repetição.",
      path: ["date"],
    }
  );



export function BookingForm({ refetch }: { refetch: () => void }) {
  const [open, setOpen] = useState(false)

  const { data: rooms, error: errorList, isLoading, } = useQuery<Room[]>({
    queryKey: ['list rooms'],
    queryFn: async () => {
      const res = await listRooms(1);
      return res;
    },
  });


  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema) })
  const [success, setsuccess] = useState('');
  const [error, seterror] = useState('');
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formatDateTime = (time: string, date: string): string => {
      const [hours, minutes] = time.split(":");
      const formattedDate = new Date(date)
      formattedDate.setHours(Number(hours), Number(minutes), 0, 0);
      return formattedDate.toISOString();
    };
  
    const selectedDate = "2025-02-14";
    const formattedStartTime = formatDateTime(values.startTime, selectedDate);
    const formattedEndTime = formatDateTime(values.endTime, selectedDate);
    const formattedValues = {
      ...values,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };
  
    console.log(formattedValues);
    setsuccess('');
    seterror('');
  
    try {
      const response = await addBooking(formattedValues);
      if (response.message === "Conflito de horários para essa sala.") {
        seterror('Conflito de horários para essa sala. Por favor, tente outro horário.');
        return;
      }
      console.log(response);
  
      if (response) {
        setsuccess('Reserva feita com sucesso!');
        setTimeout(() => {
          setOpen(false);
          setsuccess('');
          seterror('');
          form.reset();
          refetch();
        }, 1500);
      }
    } catch (error: any) {
      seterror(error.message);
    }
  }
  const [openCalendar, setOpenCalendar] = useState(false);
  
  const repeats = [
    { id: 'none', name: 'Nenhum dia', },
    { id: 'day', name: 'Diariamente', },
    { id: 'week', name: 'Semanalmente', },
    { id: 'month', name: 'Mensalmente', }
  ];

  const days = [
    { id: 1, name: 'Domingo', },
    { id: 2, name: 'Segunda', },
    { id: 3, name: 'Terça', },
    { id: 4, name: 'Quarta', },
    { id: 5, name: 'Quinta', },
    { id: 6, name: 'Sexta', },
    { id: 7, name: 'Sábado', }
  ];

  const [selectedRepeat, setSelectedRepeat] = useState<string | null>('none');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild >
        <Button variant="default" className="bg-amber-500 z-20  hover:bg-amber-100 hover:text-amber-500">Fazer Reserva</Button>
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
                          <SelectItem value={name} key={_id}>
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

              <FormField
                control={form.control}
                name="repeat"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Repetir</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        const selected = repeats?.find((r) => r.name === value);
                        setSelectedRepeat(selected?.id || null);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-[48px]" style={{ marginTop: 0 }}>
                          <SelectValue defaultChecked  placeholder="Nenhum dia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent >
                        {repeats?.map((repeat: { id: string, name: string }) => {
                          const { id, name, } = repeat
                          return (
                            <SelectItem value={name}>
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
            {selectedRepeat != "none" && (
              <FormField
                control={form.control}
                name="dayRepeat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qual dia deve se repetir?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} >
                      <FormControl>
                        <SelectTrigger className="h-[48px]" style={{ marginTop: 0 }}>
                          <SelectValue placeholder="Segunda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent >
                        {days?.map((repeat: { id: string, name: string }) => {
                          const { id, name, } = repeat
                          return (
                            <SelectItem value={name} key={id}>
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
                {error && <div className='bg-red-200 py-2 px-4 rounded-md '><p className="text-red-500">{error}</p></div>}
                {success && <div className='bg-green-200 py-2 px-4 rounded-md '><p className="text-green-500">{success}</p></div>}
                <Button>
                  <button type="submit" style={{ flexGrow: 1, padding: '25px 40px', borderRadius: 100 }}>Concluir reserva</button>
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

