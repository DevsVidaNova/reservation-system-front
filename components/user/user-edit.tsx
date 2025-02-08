"use client"
import { useState, useEffect } from "react"
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
import { Pencil } from "lucide-react"
import { editUserById,  } from "@/app/api/admin"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "O nome deve ter pelo menos 2 palavras.",
    }),
    phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, {
        message: "Informe um número de celular válido com DDD e 11 dígitos.",
    }),
    email: z.string().email({
        message: "Informe um e-mail válido.",
    }),
})

export function UserEditForm({ id, refetch, defaultValue }: { id: string, refetch: () => void, defaultValue: any }) {
    const [open, setOpen] = useState(false)
    const [success, setsuccess] = useState('');
    const [error, seterror] = useState('');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
        },
    })
    useEffect(() => {
        if (defaultValue) {
            form.setValue('name', defaultValue.name)
            form.setValue('phone', defaultValue.phone)
            form.setValue('email', defaultValue.email)
        }
    }, [defaultValue])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        seterror('')
        setsuccess('')
        try {
            const response = await editUserById(id, values)
            if (response) {
                setsuccess('Usuário editado com sucesso!')
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
            <DialogTrigger asChild >
                <Button variant='outline' className='w-[38px] h-[42px] rounded-lg'>
                    <Pencil size={24} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[455px]">
                <DialogHeader>
                    <DialogTitle>Editar usuário</DialogTitle>
                    <DialogDescription>Preencha os dados do usuário e clique em salvar.</DialogDescription>
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
                                        <Input placeholder="Nome completo" {...field} />
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
                                            placeholder="(47) 99123-4567"
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input placeholder="E-mail" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="border-t-2 pt-[16px] ">
                            <div className="flex flex-col w-full">
                                {success && <div className='bg-green-200 mb-4 py-2 px-4 rounded-md '><p className="text-green-500">{success}</p></div>}
                                {error && <div className='bg-red-200 mb-4 py-2 px-4 rounded-md '><p className="text-red-500">{error}</p></div>}
                                <Button>
                                    <button type='submit' className="text-[18px] font-semibold py-6 rounded-full w-full">Salvar usuário</button>
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

