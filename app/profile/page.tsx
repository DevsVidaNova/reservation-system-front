"use client"
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

import { useQuery } from '@tanstack/react-query'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { UserList } from '@/app/api/types'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { excludeUser, editUser, showUser } from '@/app/api/user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { User } from 'lucide-react';
import Link from 'next/link'

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

export default function Profile() {
  const [error, seterror] = useState('');
  const { data: user, error: isError, isLoading, refetch } = useQuery<UserList>({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await showUser();
      return res;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    seterror('')
    try {
      const response = await editUser(values)
      if (response) {
        toast({
          title: "Usuário criado com sucesso!",
          description: "Deu tudo certo, o usuário foi criado com sucesso.",
        })
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

  useEffect(() => { 
    if (user) {
      form.setValue('name', user.name)
      form.setValue('phone', user.phone)
      form.setValue('email', user.email)
    }
  }, [user])

 // if (isLoading) return <p>Carregando...</p>
 // if (isError) return <p>Erro ao carregar usuários</p>

  return (
    <div className="flex flex-col w-full  px-4 py-4">
      <div className='w-[124px] h-[124px] items-center justify-center bg-[#000000] flex flex-col rounded-full self-center'>
        <User size={52} color='#fff' />
      </div>
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
            <div className="flex flex-col w-full gap-4">
              {error && <div className='bg-red-200 mb-4 py-2 px-4 rounded-md '><p className="text-red-500">{error}</p></div>}
              <Button type="submit" className="text-[18px] font-semibold py-6 rounded-full w-full">Salvar alterações</Button>
              <Link href="/" className='flex w-full '>
                <Button variant='outline' className="text-[18px] w-full font-semibold">Voltar para reservas</Button>
              </Link> 
            </div>
        </form>
      </Form>
    </div>
  )
}


