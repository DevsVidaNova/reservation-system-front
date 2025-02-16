"use client"
import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { editRoom,  } from "@/app/__api/rooms"
import { Pencil } from "lucide-react"

const formSchema = z.object({
    id: z.string(),
    name: z.string().min(2, { message: "O nome da sala deve ter pelo menos 2 caracteres." }),
    size: z.number().min(1, { message: "A sala deve comportar pelo menos 1 pessoa." }),
    description: z.string().min(3, { message: "A descrição deve ter pelo menos 3 caracteres." }),
    exclusive: z.boolean(),
    status: z.boolean(),
})

export function RoomEditForm({ id, refetch, defaultValues }: { id: string, refetch: () => void, defaultValues: any }) {
    const [open, setOpen] = useState(false)
    const [success, setsuccess] = useState('');
    const [error, seterror] = useState('');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: id,
            name: "",
            size: 1,
            description: "",
            exclusive: false,
            status: false,
        },
    })

    useEffect(() => {
        if (defaultValues) {
            form.setValue("name", defaultValues.name)
            form.setValue("size", defaultValues.size)
            form.setValue("description", defaultValues.description)
            form.setValue("exclusive", defaultValues.exclusive)
            form.setValue("status", defaultValues.status)
        }
    }, [defaultValues])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        seterror('')
        setsuccess('')
        try {
            const response = await editRoom(id, values)
            if (response) {
                setsuccess('Sala editado com sucesso!')
                refetch()
                setTimeout(() => {
                    setOpen(false)
                }, 1500);
            }
        } catch (error: any) {
            seterror(error.message)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='outline' className='w-[38px] h-[42px] rounded-lg'>
                    <Pencil size={24} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[455px]">
                <DialogHeader>
                    <DialogTitle>Editar Sala</DialogTitle>
                    <DialogDescription>Preencha os dados da sala e clique em salvar.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl><Input placeholder="Nome da sala" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="size" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Capacidade</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Quantidade de pessoas" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descrição</FormLabel>
                                <FormControl><Input placeholder="Descrição da sala" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

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
                                {success && <div className='bg-green-200 mb-4 py-2 px-4 rounded-md '><p className="text-green-500">{success}</p></div>}
                                {error && <div className='bg-red-200 mb-4 py-2 px-4 rounded-md '><p className="text-red-500">{error}</p></div>}
                                <Button>
                                    <button type="submit" className="text-[18px] font-semibold py-6 rounded-full w-full">Salvar sala</button>
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}