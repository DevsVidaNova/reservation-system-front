"use client"
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { useQuery } from '@tanstack/react-query'
import { UserList } from '@/app/api/types'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { User } from 'lucide-react';

import { editUser, showUser } from '@/app/api/user';
import { getUser } from '@/hooks/user'

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

  const [success, setsuccess] = useState('');
  const [error, seterror] = useState('');
  const [userId, setuserId] = useState('');
  const { data: user, error: isError, isLoading, } = useQuery<UserList>({
    queryKey: ['bookings'],
    queryFn: async () => {
      const useres = await getUser()
      setuserId(useres?.id)
      const res = await showUser(useres?.id);
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
    setsuccess('')
    try {
      const response: any = await editUser(userId, values)
      setsuccess(response?.message)
    } catch (error: any) {
      seterror(error.message)
    }
  }

  useEffect(() => {
    if (user) {
      form.setValue('name', user.name)
      form.setValue('phone', user.phone)
      form.setValue('email', user.email)
    }
  }, [user])

  if (isLoading) return <p>Carregando...</p>
  if (isError) return <p>Erro ao carregar usuários</p>

  return (
    <div className='w-full bg-background'>
    <div className="flex flex-col max-w-[500px] container px-3 py-4 m-auto">
      <div className='w-[124px] h-[124px] items-center justify-center bg-[#303030] flex flex-col rounded-full self-center'>
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
            {success && <div className='bg-green-200 mb-4 py-2 px-4 rounded-md '><p className="text-green-500">{success}</p></div>}
            <Button type="submit" className="text-[18px] font-semibold py-6 rounded-full w-full">Salvar alterações</Button>
          </div>
        </form>
      </Form>
      </div>
    </div>
      
  )
}


