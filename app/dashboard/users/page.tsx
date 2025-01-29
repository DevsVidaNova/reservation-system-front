"use client"
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, } from "@/components/ui/card"
import { UserAddForm } from '@/components/user-add'
import { useQuery } from '@tanstack/react-query'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { UserList } from '@/app/api/types'
import { Trash } from 'lucide-react'
import { Input } from '@/components/ui/input'

import { excludeUserById, listUsers } from '@/app/api/admin'
import { UserEditForm } from '@/components/user-edit'

export default function Users() {
  const [page, setpage] = useState(1);
  const { data: users, error, isLoading, refetch } = useQuery<UserList[]>({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await listUsers(page);
      return res;
    },
  });
  useEffect(() => {
    if (page > 1) {
      refetch()
    }
  }, [page])

  if (isLoading) return <p>Carregando...</p>
  if (error) return <p>Erro ao carregar usuários</p>

  return (
    <div className="flex flex-col w-full px-4 py-4 container">
      <ListUsers users={users || []} refetch={refetch} setpage={setpage} page={page} />
    </div>
  )
}

const ListUsers = ({ users, refetch, setpage, page }: { users: UserList[], refetch: () => void, setpage: (page: number) => void; page: number, }) => {
  return (
    <>
      <div className=' flex flex-col  gap-4'>
        <div className='flex flex-row justify-between items-center'>
          <h2 className='text-[24px] font-bold'>Usuários cadastrados</h2>
          <div className='md:block hidden'>
            <UserAddForm refetch={refetch} />
          </div>
        </div>
        <div>
          <TableUsers users={users || []} refetch={refetch} page={page} setpage={setpage} />
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 50, left: '50%', transform: 'translateX(-50%)' }} className='justify-center items-center md:hidden'>
        <UserAddForm refetch={refetch} />
      </div>
    </>
  )
}

const TableUsers = ({ users, refetch, setpage, page }: { users: UserList[], refetch: () => void, setpage: (page: number) => void; page: number, }) => {
  if (!users) return <p>Carregando...</p>

  const [confirmation, setconfirmation] = useState('');
  const [openExclude, setOpenExclude] = useState(false)

  const handleExcludeUser = async (id: string, confirmation: string) => {
    if (confirmation !== 'sim') {
      return
    }
    try {
      await excludeUserById(id)
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
            <TableHead className='text-wrap min-w-[60px] '>Email</TableHead>
            <TableHead >Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map(user => (
            <TableRow key={user.email}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell className='text-wrap min-w-[60px] ' style={{ wordBreak: 'break-word' }}>{user.email}</TableCell>
              <TableCell >
                <div className='flex flex-row gap-4'>
                  <Dialog open={openExclude} onOpenChange={setOpenExclude}>
                    <DialogTrigger asChild >
                      <Button variant='outline' className='w-[38px] h-[42px] rounded-lg'>
                        <Trash size={24} />
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
                  <UserEditForm id={user._id} refetch={refetch} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>


      </Table>
      <div className='flex flex-row w-full bg-neutral-50 px-2 py-2 items-center gap-2 justify-center'>
        <div className='border rounded-lg text-[16px] w-[42px] h-[42px] items-center justify-center flex flex-col cursor-pointer' onClick={() => setpage(page == 1 ? 1 : page - 1)}>{page - 1}</div>
        <div className='bg-[#000] text-[#fff] rounded-lg text-[16px] w-[42px] h-[42px] items-center justify-center flex flex-col cursor-pointer'  >{page}</div>
        <div className='border rounded-lg text-[16px] w-[42px] h-[42px] items-center justify-center flex flex-col cursor-pointer' onClick={() => setpage(page + 1)} >{page + 1}</div>
      </div>
    </Card>
  )
}