"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { parse, format, isValid } from "date-fns";
import { addBooking } from "@/app/__api/booking";
import { useQuery } from "@tanstack/react-query";
import { listRooms } from "@/app/__api/rooms";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const formSchema = z
  .object({
    description: z.string({ required_error: "A descrição deve ter pelo menos 2 palavras." }).min(2, { message: "A descrição deve ter pelo menos 2 palavras." }),
    room: z.string({ required_error: "Por favor, selecione uma sala." }).min(1, { message: "Por favor, selecione uma sala." }),
    start_time: z.string({ required_error: "Por favor, insira a hora de início." }),
    end_time: z.string({ required_error: "Por favor, insira a hora de término" }),
    date: z.string().optional(),
    repeat: z.string().optional(),
    day_repeat: z.string().optional()
  })
  .refine(
    data => {
      if (data.day_repeat || (data.date && data.date.length === 10)) {
        if (data.date) {
          const parsedDate = parse(data.date, "dd/MM/yyyy", new Date());
          return isValid(parsedDate);
        }
        return true;
      }
      return false;
    },
    {
      message: "Informe uma data válida ou escolha um intervalo de repetição.",
      path: ["date"]
    }
  );

const days = [
  { id: "0", name: "Domingo" },
  { id: "1", name: "Segunda" },
  { id: "2", name: "Terça" },
  { id: "3", name: "Quarta" },
  { id: "4", name: "Quinta" },
  { id: "5", name: "Sexta" },
  { id: "6", name: "Sábado" }
];

export function BookingAddPopup({ start, end, onClose, onSaved }: { start: any; end: any; onClose: () => void; onSaved: () => void }) {
  const [loading, setLoading] = useState(false);

  const { data: rooms } = useQuery({
    queryKey: ["rooms"],
    queryFn: listRooms
  });

  const { defaultDate, defaultStartTime, defaultEndTime } = useMemo(() => {
    if (!start || !end) return { defaultDate: "", defaultStartTime: "08:00", defaultEndTime: "09:00" };

    const initial = new Date(start);
    const final = new Date(end);

    return {
      defaultDate: format(initial, "dd/MM/yyyy"),
      defaultStartTime: format(initial, "HH:mm"),
      defaultEndTime: format(final, "HH:mm")
    };
  }, [start, end]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: defaultDate,
      start_time: defaultStartTime,
      end_time: defaultEndTime,
      description: "",
      room: "",
      repeat: "null",
      day_repeat: ""
    }
  });
  const { control, handleSubmit, watch, setValue } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await addBooking({
        ...values,
        repeat: values.repeat === "null" ? null : values.repeat,
        day_repeat: values.repeat === "null" ? null : values.day_repeat
      });

      onSaved();
      onClose();
    } catch (err) {
      console.error("Erro ao atualizar reserva:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleDateInput(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) return;

    if (value.length > 4) {
      value = value.replace(/^(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,2})/, "$1/$2");
    }

    if (value.length === 10) {
      const [day, month, year] = value.split("/").map(Number);

      if (month < 1 || month > 12) {
        form.setValue("date", "");
        return;
      }

      const daysInMonth = new Date(year, month, 0).getDate();
      if (day < 1 || day > daysInMonth) {
        form.setValue("date", "");
        return;
      }

      form.setValue("date", value);
    } else {
      form.setValue("date", value);
    }
  }

  const repeatValue = watch("repeat");

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogPortal forceMount>
        <AnimatePresence>
          <motion.div key="overlay" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        </AnimatePresence>

        <AnimatePresence>
          <motion.div key="popup" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="fixed z-50 left-1/2 top-1/2 w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6">
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition">
              <X size={20} />
            </button>

            <img src="/imgs/banner3.png" alt="banner" className="w-full h-34 rounded-lg object-cover" />
            <h2 className="text-2xl font-semibold mt-4 mb-2">Criar Reserva</h2>

            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={control}
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="start_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Início</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="end_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fim</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input placeholder="dd/mm/yyyy" value={field.value || ""} onChange={handleDateInput} maxLength={10} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="repeat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repetir</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-[48px]">
                            <SelectValue placeholder="Repetição" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="null">Nenhum</SelectItem>
                          <SelectItem value="day">Diário</SelectItem>
                          <SelectItem value="week">Semanal</SelectItem>
                          <SelectItem value="month">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {repeatValue !== "null" && (
                  <FormField
                    control={control}
                    name="day_repeat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qual dia deve se repetir?</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-[48px]">
                              <SelectValue placeholder="Segunda" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {days.map(({ id, name }) => (
                              <SelectItem value={id} key={id}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={control}
                  name="room"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sala</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-[48px]">
                            <SelectValue placeholder="Selecione uma sala" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rooms?.map(room => (
                            <SelectItem key={room.id} value={room.id}>
                              {room.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1" variant="success">
                    Salvar
                  </Button>
                  <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                    Voltar
                  </Button>
                </div>
                
              </form>
            </Form>
          </motion.div>
        </AnimatePresence>
      </DialogPortal>
    </Dialog>
  );
}
