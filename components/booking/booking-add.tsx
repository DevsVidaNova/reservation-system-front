"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { parse, format as formatDateFns } from "date-fns";

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
  Button,
  Message
} from "@/components/ui";

import { useQuery } from "@tanstack/react-query";
import { ListRoom } from "@/app/__api/types";
import { addBooking } from "@/app/__api/booking";
import { listRooms } from "@/app/__api/rooms";

import { CalendarSearch, CalendarX2, HelpCircle, Users } from "lucide-react";
import Link from "next/link";

const formSchema = z
  .object({
    description: z.string({ required_error: "A descrição deve ter pelo menos 2 palavras."}).min(2, { message: "A descrição deve ter pelo menos 2 palavras." }),
    room: z.string({ required_error: "Por favor, selecione uma sala." }),
    start_time: z.string({ required_error: "Por favor, insira a hora de início." }),
    end_time: z.string({ required_error: "Por favor, insira a hora de término" }),
    date: z.string().optional(),
    repeat: z.string().optional(),
    day_repeat: z.string().optional(),
  })
  .refine(
    (data) => data.day_repeat || (data.date && data.date.length === 10),
    {
      message: "Informe uma data válida ou escolha um intervalo de repetição.",
      path: ["date"],
    }
  );

const repeats = [
  { id: "null", name: "Nenhum dia" },
  { id: "day", name: "Diariamente" },
  { id: "week", name: "Semanalmente" },
  { id: "month", name: "Mensalmente" },
];

const days = [
  { id: "0", name: "Domingo" },
  { id: "1", name: "Segunda" },
  { id: "2", name: "Terça" },
  { id: "3", name: "Quarta" },
  { id: "4", name: "Quinta" },
  { id: "5", name: "Sexta" },
  { id: "6", name: "Sábado" },
];

export function BookingForm({ refetch }: { refetch: () => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { repeat: "null" }
  });

  const [openCalendar, setOpenCalendar] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: rooms } = useQuery<ListRoom[]>({
    queryKey: ["list rooms"],
    queryFn: listRooms
  });

  const hasRepeat = form.watch("repeat");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSuccess("");
    setError("");
    setLoading(true);
  
    try {
      const payload = {
        ...values,
        date: values.date ?? undefined,
        repeat: values.repeat === "null" ? null : values.repeat,
        day_repeat: values.repeat === "null" ? null : values.day_repeat,
      };
  
      const res = await addBooking(payload);
  
      if (res?.error) {
        if (/reserva nesse horário/i.test(res.error)) {
          setError("⚠️ Já existe uma reserva nesse horário para essa sala.");
        } else {
          setError(`❌ Erro ao salvar: ${res.error}`);
        }
        return;
      }
  
      setSuccess("✅ Reserva feita com sucesso!");
      await refetch();
      form.reset({ repeat: "null" });
    } catch (err: any) {
      console.error("❌ Erro inesperado:", err);
      setError("Erro inesperado ao salvar a reserva.");
    } finally {
      setLoading(false);
    }
  }  
  
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="bg-amber-500 z-20 hover:bg-amber-100 hover:text-amber-500">
          Fazer Reserva
        </Button>
      </DrawerTrigger>
      <DrawerContent>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <div className="flex gap-2">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma sala" />
                          </SelectTrigger>
                          <Link href="/gallery">
                            <div className="w-[52px] h-[48px] border rounded flex items-center justify-center">
                              <HelpCircle size={24} />
                            </div>
                          </Link>
                        </div>
                      </FormControl>
                      <SelectContent>
                        {rooms?.map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            <div className="flex flex-col">
                              <span className="font-semibold text-sm">
                                {room.name} {room.exclusive ? " (Exclusiva)" : ""}
                              </span>
                              <div className="flex gap-2 items-center text-xs opacity-60">
                                <Users size={14} /> {room.size} pessoas
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4 relative">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data</FormLabel>
                      <div className="flex items-center gap-2">
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
                        <Button
                          type="button"
                          className="w-[48px] h-[48px] rounded"
                          onClick={() => setOpenCalendar(!openCalendar)}
                        >
                          {openCalendar ? <CalendarX2 /> : <CalendarSearch />}
                        </Button>
                      </div>
                      {openCalendar && (
                        <div className="absolute z-50 top-full mt-2 left-0 bg-white shadow-md rounded">
                          <Calendar
                            mode="single"
                            selected={field.value ? parse(field.value, "dd/MM/yyyy", new Date()) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                const formattedDate = formatDateFns(date, "dd/MM/yyyy");
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
                    <FormItem>
                      <FormLabel>Repetir</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-[48px]">
                            <SelectValue placeholder="Nenhum dia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {repeats.map(({ id, name }) => (
                            <SelectItem value={id} key={id}>{name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {hasRepeat !== 'null' && (
                <FormField
                  control={form.control}
                  name="day_repeat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qual dia deve se repetir?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-[48px]">
                            <SelectValue placeholder="Segunda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {days.map(({ id, name }) => (
                            <SelectItem value={id} key={id}>{name}</SelectItem>
                          ))}
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
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <CalendarSearch className="animate-spin" size={16} />
                        Salvando...
                      </div>
                    ) : (
                      "Concluir reserva"
                    )}
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
  );
}
