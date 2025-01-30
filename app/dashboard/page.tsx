"use client"
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { BookMarked, BookPlus, Calendar1, MapPin, Trash, UserPlus, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { excludeUser } from '@/app/api/user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Stats } from '../api/types'
import { useQuery } from '@tanstack/react-query'
import { listDash } from '@/app/api/dashboard'
import Link from 'next/link'

export default function Dashboard() {

  const { data, error, isLoading } = useQuery<Stats>({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await listDash();
      return res;
    },
  });

  const { rooms, bookings, users, week } = data || {};

  if (isLoading) return <p>Carregando...</p>
  if (error) return <p>Erro ao carregar usuários</p>


  return (
    <div className="flex flex-col w-full  px-4 py-4">
      <div className='container justify-center px-2 gap-2 flex flex-col self-center md:self-start'>
        <h2 className='text-[32px] font-bold'>Dashboard</h2>
        <div className="flex flex-row gap-4 flex-wrap align-center ">
          <Card>
            <CardHeader>
              <div className="flex flex-row justify-between align-center items-center">
                <Users size={32} />
                <span className='text-[32px] font-bold'>{users}</span>
              </div>
              <CardTitle className='opacity-70 text-[20px]'>Usuários ativos</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex flex-row justify-between align-center items-center">
                <MapPin size={32} />
                <span className='text-[32px] font-bold'>{rooms}</span>
              </div>
              <CardTitle className='opacity-70 text-[20px]'>Salas criadas</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex flex-row justify-between align-center items-center">
                <BookMarked size={32} />
                <span className='text-[32px] font-bold'>{bookings}</span>
              </div>
              <CardTitle className='opacity-70 text-[20px]'>Reservas feitas</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex flex-row justify-between align-center items-center">
                <Calendar1 size={32} />
                <span className='text-[32px] font-bold'>{week}</span>
              </div>
              <CardTitle className='opacity-70 text-[20px]'>Para semana</CardTitle>
            </CardHeader>
          </Card>
        </div>

        
        <h2 className='text-[32px] font-bold'>Ações</h2>
        <div className="flex flex-row gap-4 flex-wrap align-center ">
          <Card className='max-w-[300px]'>
            <CardHeader>
              <div className="flex flex-row justify-between align-center items-center">
                <UserPlus size={42} />
              </div>
              <CardTitle >Adicionar novo usuário</CardTitle>
              <CardDescription className='text-[16px] font-normal' style={{ lineHeight: 1, }}>Usuários podem criar reservas sozinhos. Para um novo usuário você precisará do seguintes dados: nome, telefone, e-mail e senha.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href='/dashboard/users'>
                <Button className='w-full'>Criar usuário</Button>
              </Link>
            </CardContent>
          </Card>
          <Card className='max-w-[300px]'>
            <CardHeader>
              <div className="flex flex-row justify-between align-center items-center">
                <BookPlus size={42} />
              </div>
              <CardTitle >Adicionar nova sala</CardTitle>
              <CardDescription className='text-[16px] font-normal' style={{ lineHeight: 1, }}>Salas servem para serem reservadas. Para uma nova sala você precisará do seguintes dados: nome, quantidade de pessoas, descrição e exclusividade.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href='/dashboard/rooms'>
                <Button className='w-full'>Criar sala</Button>
              </Link>
            </CardContent>
          </Card>
          <Card className='max-w-[300px]'
          >
            <CardHeader>
              <div className="flex flex-row justify-between align-center items-center">
                <BookMarked size={42} />
              </div>
              <CardTitle >Reservar sala</CardTitle>
              <CardDescription className='text-[16px] font-normal' style={{ lineHeight: 1, }}>Quando reservada a sala ficará disponível para realizar atividades. Para reserver uma sala você precisará do seguintes dados: sala, descrição, dia, hora de inicio e hora de fim.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href='/'>
                <Button className='w-full'>Reservar sala</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}