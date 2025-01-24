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
import { toast } from "@/components/ui/use-toast"
import { ScrollArea } from "./ui/scroll-area"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 palavras.",
  }),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, {
    message: "Informe um número de celular válido com DDD e 11 dígitos.",
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

export function BookingForm({refetch }: { refetch: () => void }) {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      room: "",
      date: "",
      startTime: "",
      endTime: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("https://backagenda.onrender.com/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        toast({
          title: "Reserva realizada com sucesso!",
          description: "Sua reserva foi confirmada.",
        })
        setOpen(false)
        form.reset()
        refetch()
      } else if (response.status === 409) {
        toast({
          title: "Conflito de horários",
          description: "Já existe um agendamento para essa sala no período selecionado.",
          variant: "destructive",
        })
      } else {
        throw new Error("Falha ao criar a reserva")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua reserva. Tente novamente.",
        variant: "destructive",
      })
    }
  }
  const [openCalendar, setOpenCalendar] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild >
        <Button variant="default" style={{ flexGrow: 1, padding: '25px 40px', borderRadius: 100 }}>Fazer Reserva</Button>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Celular (com DDD)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(99) 99999-9999"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .replace(/^(\d{2})(\d)/g, "($1) $2")
                          .replace(/(\d{5})(\d)/, "$1-$2")
                          .slice(0, 15)
                        field.onChange(value)
                      }}
                    />
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
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma sala" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Estúdio">Estúdio</SelectItem>
                      <SelectItem value="Espaço Multiuso">Espaço Multiuso</SelectItem>
                      <SelectItem value="Sala de aula - 1">Sala de aula - 1</SelectItem>
                      <SelectItem value="Sala de aula - 2">Sala de aula - 2</SelectItem>
                      <SelectItem value="Sala de aula - 3">Sala de aula - 3</SelectItem>
                      <SelectItem value="Cozinha">Cozinha</SelectItem>
                      <SelectItem value="Templo">Templo</SelectItem>
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

                    <Button type="button" onClick={() => setOpenCalendar(!openCalendar)}>
                      {openCalendar ? 'Fechar calendário' : 'Mostrar calendário'}
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
              <Button type="submit" style={{ flexGrow: 1, padding: '25px 40px', borderRadius: 100 }}>Concluir reserva</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

