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
import { registerUser } from "@/app/api/user"

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
    password: z.string().min(6, {
        message: "A senha deve ter pelo menos 6 caracteres.",
    }),
})

export function UserForm({ refetch }: { refetch: () => void }) {
    const [open, setOpen] = useState(false)
    const [error, seterror] = useState(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        seterror(null)
        try {
            const response = await registerUser(values)
            if (response) {
                toast({
                    title: "Usuário criado com sucesso!",
                    description: "Deu tudo certo, o usuário foi criado com sucesso.",
                })
                setOpen(false)
                form.reset()
                refetch()
            }
        } catch (error: any) {
            seterror(error.message)
            toast({
                title: "Erro",
                description: error,
                variant: "destructive",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild >
                <Button variant="default" style={{ flexGrow: 1, padding: '25px 40px', borderRadius: 100 }} className="text-[18px] font-semibold">Criar usuário</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[455px]">

                <DialogHeader>
                    <DialogTitle>Criar usuário</DialogTitle>
                    <DialogDescription>Preencha os dados do usuário para continuar.</DialogDescription>
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
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Senha</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Senha" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}  
                        />
                        <DialogFooter className="border-t-2 pt-[16px] ">
                            <div className="flex flex-col w-full">
                                {error && <div className='bg-red-200 mb-4 py-2 px-4 rounded-md '><p className="text-red-500">{error}</p></div>}
                                <Button type="submit" className="text-[18px] font-semibold py-6 rounded-full w-full">Criar usuário</Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

