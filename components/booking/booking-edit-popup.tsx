"use client";

import { useState } from "react";
import { Dialog, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { editBooking, deleteBooking } from "@/app/__api/booking";
import { useQuery } from "@tanstack/react-query";
import { listRooms } from "@/app/__api/rooms";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const formSchema = z.object({
  description: z.string().min(2),
  room: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  date: z.string().optional(),
  repeat: z.string().optional(),
  day_repeat: z.string().optional()
});

const days = [
  { id: "0", name: "Domingo" },
  { id: "1", name: "Segunda" },
  { id: "2", name: "Terça" },
  { id: "3", name: "Quarta" },
  { id: "4", name: "Quinta" },
  { id: "5", name: "Sexta" },
  { id: "6", name: "Sábado" }
];

export function BookingEditPopup({ booking, onClose, onSaved }: { booking: any; onClose: () => void; onSaved: () => void }) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: rooms } = useQuery({
    queryKey: ["rooms"],
    queryFn: listRooms
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: booking.description,
      room: booking.room?.id || "",
      start_time: booking.start_time,
      end_time: booking.end_time,
      date: booking.repeat_day ? "" : booking.date || "",
      repeat: booking.repeat || "null",
      day_repeat: days.find(day => day.name.slice(0, 3) === booking.repeat_day)?.id || ""
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await editBooking(booking.id, {
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

  async function onDelete() {
    setDeleting(true);
    try {
      await deleteBooking(booking.id);
      onSaved();
      onClose();
    } catch (err) {
      console.error("Erro ao excluir reserva:", err);
    } finally {
      setDeleting(false);
    }
  }

  function handleDateInput(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) return;
    if (value.length > 4) value = value.replace(/^(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
    else if (value.length > 2) value = value.replace(/^(\d{2})(\d{0,2})/, "$1/$2");
    form.setValue("date", value);
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogPortal forceMount>
        <AnimatePresence>
          <motion.div key="overlay" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md" />
        </AnimatePresence>

        <AnimatePresence>
          <motion.div key="popup" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="fixed z-50 left-1/2 top-1/2 w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6">
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition">
              <X size={20} />
            </button>

            <img src="/imgs/banner1.png" alt="banner" className="w-full h-34 rounded-lg object-cover" />
            <h2 className="text-2xl font-semibold mt-4 mb-2">Editar Reserva</h2>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <Input {...form.register("description")} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Início</label>
                  <Input type="time" {...form.register("start_time")} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fim</label>
                  <Input type="time" {...form.register("end_time")} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Data</label>
                <Input placeholder="dd/mm/yyyy" value={form.watch("date") || ""} onChange={handleDateInput} maxLength={10} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Repetir</label>
                <Select value={form.watch("repeat") || "null"} onValueChange={val => form.setValue("repeat", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Repetição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Nenhum</SelectItem>
                    <SelectItem value="day">Diário</SelectItem>
                    <SelectItem value="week">Semanal</SelectItem>
                    <SelectItem value="month">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.watch("repeat") !== "null" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Dia da Semana</label>
                  <Select value={form.watch("day_repeat") || ""} onValueChange={val => form.setValue("day_repeat", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha o dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map(day => (
                        <SelectItem key={day.id} value={day.id}>
                          {day.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Sala</label>
                <Select value={form.watch("room")} onValueChange={val => form.setValue("room", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sala" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms?.data?.map(room => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  Salvar
                </Button>
                <Button variant="destructive" onClick={onDelete} disabled={deleting} className="flex-1">
                  {deleting ? "Excluindo..." : "Excluir"}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" onClick={onClose} className="flex-1 grow-1">
                  Voltar
                </Button>
              </div>
            </form>
          </motion.div>
        </AnimatePresence>
      </DialogPortal>
    </Dialog>
  );
}
