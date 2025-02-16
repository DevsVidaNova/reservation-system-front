"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { BookMarked, BookPlus, Calendar1, MapPin, UserPlus, Users } from 'lucide-react'
import { Stats } from '../__api/types'
import { useQuery } from '@tanstack/react-query'
import { listDash } from '@/app/__api/dashboard'
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
    <div className="flex flex-col w-full px-4 py-4">
      <div className='container justify-center px-2 gap-2 flex flex-col self-center md:self-start'>
        <h2 className='text-[32px] font-bold'>Dashboard</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className='flex-col flex border rounded-lg px-4 py-4 '>
            <div className="flex flex-row justify-between align-center items-center">
              <Users size={24} />
              <span className='text-[24px] font-bold'>{users}</span>
            </div>
            <span className='opacity-70 text-[16px] font-regular'>Usuários ativos</span>
          </div>
          <div className='flex-col flex border rounded-lg px-4 py-4 '>
            <div className="flex flex-row justify-between align-center items-center">
              <MapPin size={24} />
              <span className='text-[24px] font-bold'>{rooms}</span>
            </div>
            <span className='opacity-70 text-[16px] font-regular'>Salas criadas</span>
          </div>
          <div className='flex-col flex border rounded-lg px-4 py-4 '>
            <div className="flex flex-row justify-between align-center items-center">
              <BookMarked size={24} />
              <span className='text-[24px] font-bold'>{bookings}</span>
            </div>
            <span className='opacity-70 text-[16px] font-regular'>Reservas feitas</span>
          </div>
          <div className='flex-col flex border rounded-lg px-4 py-4 '>
            <div className="flex flex-row justify-between align-center items-center">
              <Calendar1 size={24} />
              <span className='text-[24px] font-bold'>{week}</span>
            </div>
            <span className='opacity-70 text-[16px] font-regular'>Para semana</span>
          </div>
        </div>
        <h2 className='text-[32px] font-bold'>Ações</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="w-full">
            <CardHeader>
              <div className="flex flex-row justify-between items-center">
                <UserPlus size={42} />
              </div>
              <CardTitle>Adicionar novo usuário</CardTitle>
              <CardDescription className="text-[16px] font-normal" style={{ lineHeight: 1 }}>
                Usuários podem criar reservas sozinhos. Para um novo usuário você precisará dos seguintes dados: nome, telefone, e-mail e senha.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/users">
                <Button className="w-full">Criar usuário</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <div className="flex flex-row justify-between items-center">
                <BookPlus size={42} />
              </div>
              <CardTitle>Adicionar nova sala</CardTitle>
              <CardDescription className="text-[16px] font-normal" style={{ lineHeight: 1 }}>
                Salas servem para serem reservadas. Para uma nova sala você precisará dos seguintes dados: nome, quantidade de pessoas, descrição e exclusividade.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/rooms">
                <Button className="w-full">Criar sala</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <div className="flex flex-row justify-between items-center">
                <BookMarked size={42} />
              </div>
              <CardTitle>Reservar sala</CardTitle>
              <CardDescription className="text-[16px] font-normal" style={{ lineHeight: 1 }}>
                Quando reservada, a sala ficará disponível para realizar atividades. Para reservar uma sala, você precisará dos seguintes dados: sala, descrição, dia, hora de início e hora de fim.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/bookings">
                <Button className="w-full">Reservar sala</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}