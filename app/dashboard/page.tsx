"use client"
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { UserAddForm } from '@/components/user_add'
import { useQuery } from '@tanstack/react-query'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { listUsers } from '../api/user'
import { UserList } from '../api/types'
import { Trash } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { excludeUser } from '@/app/api/user';

export default function Dashboard() {
  const { data: users, error, isLoading, refetch } = useQuery<UserList[]>({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await listUsers();
      return res;
    },
  });
  if (isLoading) return <p>Carregando...</p>
  if (error) return <p>Erro ao carregar usuários</p>

  return (
    <div className="flex flex-col w-full  px-4 py-4">
      <div className=' flex flex-col self-center gap-4'>
        <div className='flex flex-row justify-between items-center'>
          <h2 className='text-[24px] font-bold'>Usuários cadastrados</h2>
          <div className='md:block hidden'>
            <UserAddForm refetch={refetch} />
          </div>
        </div>
        <div>
          <TableUsers users={users || []} refetch={refetch} />
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 50, left: '50%', transform: 'translateX(-50%)' }} className='justify-center items-center md:hidden'>
        <UserAddForm refetch={refetch} />
      </div>
    </div>
  )
}


const TableUsers = ({ users, refetch }: { users: UserList[], refetch: () => void }) => {
  if (!users) return <p>Carregando...</p>

  const [confirmation, setconfirmation] = useState('');
  const [open, setOpen] = useState(false)

  const handleExcludeUser = async (id: string, confirmation: string) => {
    console.log(id, confirmation)
    if (confirmation !== 'sim') {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua reserva. Tente novamente.",
        variant: "destructive",
      })
      return
    }
    try {
      await excludeUser(id)
      refetch()
    } catch (error: any) {
      console.log(error)
    }
  }

  return (
    <Card className='overflow-hidden'>
      <Table>
        <TableHeader >
          <TableRow className='bg-neutral-50'>
            <TableHead >Nome</TableHead>
            <TableHead >Telefone</TableHead>
            <TableHead >Email</TableHead>
            <TableHead >Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map(user => (
            <TableRow key={user.email}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild >
                    <Button variant='outline'>
                      <Trash />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[455px]">

                    <DialogHeader>
                      <DialogTitle>Excluir usuário</DialogTitle>
                      <DialogDescription>Tem certeza que quer excluir o usuário? Digite "sim" para confirmar</DialogDescription>
                      <Input
                        id='confirmation'
                        label='Confirmação'
                        placeholder='Leia a mensagem acima'
                        value={confirmation}
                        onChange={(e) => setconfirmation(e.target.value)}
                      />

                    </DialogHeader>
                    <DialogFooter className="border-t-2 pt-[16px]">
                      <DialogClose asChild>
                        <Button onClick={() => handleExcludeUser(user._id, confirmation)} style={{ flexGrow: 1, padding: '25px 40px', borderRadius: 100 }} className="text-[18px] font-semibold ">Excluir usuário</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>


              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}