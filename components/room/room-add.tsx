"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
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
import { addRoom } from "@/app/api/rooms"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "O nome da sala deve ter pelo menos 2 caracteres.",
    }),
    size: z.number().min(1, {
        message: "A sala deve comportar pelo menos 1 pessoa.",
    }),
    description: z.string().min(5, {
        message: "A descrição deve ter pelo menos 5 caracteres.",
    }),
    exclusive: z.boolean(),
    status: z.boolean(),
})

export function RoomAddForm({ refetch }: { refetch: () => void }) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            size: 1,
            description: "",
            exclusive: false,
            status: true,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setError(null)
        try {
            const response = await addRoom(values)
            if (response) {
                toast({
                    title: "Sala criada com sucesso!",
                    description: "A sala foi adicionada com sucesso.",
                })
                setOpen(false)
                form.reset()
                refetch()
            }
        } catch (error: any) {
            setError(error.message)
            toast({
                title: "Erro",
                description: error.message,
                variant: "destructive",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" >Criar Sala</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[455px]">
                <DialogHeader>
                    <DialogTitle>Criar Sala</DialogTitle>
                    <DialogDescription>Preencha os dados da sala para continuar.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome da Sala</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome da sala" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="size"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Capacidade</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Quantidade de pessoas" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Descrição da sala" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                          <FormField control={form.control} name="exclusive" render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel>Exclusiva</FormLabel>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="status" render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel>Ativa</FormLabel>
                            </FormItem>
                        )} />
                        <DialogFooter className="border-t-2 pt-[16px]">
                            <div className="flex flex-col w-full">
                                {error && <div className='bg-red-200 mb-4 py-2 px-4 rounded-md '><p className="text-red-500">{error}</p></div>}
                                <Button type="submit" className="text-[18px] font-semibold py-6 rounded-full w-full">Criar Sala</Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
