"use client"
import {  useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, } from "@/components/ui/card"
import { UserAddForm } from '@/components/user/user-add'
import { useQuery } from '@tanstack/react-query'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { ListUser, User } from '@/app/__api/types'
import { EllipsisVertical, Trash } from 'lucide-react'
import { Input } from '@/components/ui/input'

import { excludeUserById, listUsers } from '@/app/__api/admin'
import { UserEditForm } from '@/components/user/user-edit'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Pagination from "@/components/pagination";

export default function Users() {
  const [page, setpage] = useState(1);
  const { data, error, isLoading, refetch } = useQuery<ListUser>({
    queryKey: [`list users ${page}`],
    queryFn: async () => {
      return await listUsers(page)
    },
  });

  if (isLoading) return <div className="flex flex-col w-full px-4 py-4 container"><p>Carregando...</p></div>
  if (error) return <div className="flex flex-col w-full px-4 py-4 container"><p>Erro ao carregar usuários</p></div>

  return (
    <div className="flex flex-col w-full px-3 py-4 container">
      {data && <ListUsers users={data} refetch={refetch} setpage={setpage} page={page} />}
    </div>
  )
}

const ListUsers = ({ users, refetch, setpage, page, }: { users: ListUser, refetch: () => void,  setpage: (page: number) => void; page: number }) => {
  return (
    <>
      <div className=' flex flex-col  gap-4'>
        <div className='flex flex-row justify-between items-center'>
          <h2 className='md:text-[28px] text-[22px] font-bold'>Usuários cadastrados</h2>
          <div className='md:block hidden'>
            <UserAddForm refetch={refetch} />
          </div>
        </div>
        <div> 
          <TableUsers users={users?.data || []} refetch={refetch} />
          <Pagination page={page} setpage={setpage} data={users} />
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 50, left: '50%', transform: 'translateX(-50%)' }} className='justify-center items-center md:hidden'>
        <UserAddForm refetch={refetch} />
      </div>
    </>
  )
}

const TableUsers = ({ users, refetch, }: { users: User[], refetch: () => void, }) => {
  if (!users) return <p>Carregando...</p>

  const [confirmation, setconfirmation] = useState('');
  const [openExclude, setOpenExclude] = useState(false)

  const handleExclude = async (id: string, confirmation: string) => {
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
          <TableRow className='opacity-70'>
            <TableHead >Nome</TableHead>
            <TableHead >Telefone</TableHead>
            <TableHead className='text-wrap min-w-[60px] '>Email</TableHead>
            <TableHead >Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map(user => (
            <TableRow key={user.email}>
              <TableCell className='text-[12px] md:text-[18px] leading-none font-light text-neutral-600'>{user.name}</TableCell>
              <TableCell className='text-[12px] md:text-[18px] leading-none font-light text-neutral-600'>{user.phone}</TableCell>
              <TableCell className='text-wrap min-w-[60px] text-[12px] md:text-[18px] leading-none font-light text-neutral-600' style={{ wordBreak: 'break-word' }}>{user.email}</TableCell>
              <TableCell className=''>
                <div className=' md:flex hidden gap-3 flex-row '>
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
                          <Button onClick={() => handleExclude(user.user_id, confirmation)} style={{ flexGrow: 1, padding: '25px 40px', borderRadius: 100 }} className="text-[18px] font-semibold ">Excluir usuário</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <UserEditForm id={user.user_id} refetch={refetch} defaultValue={user} />
                  </div>
                <div className='block md:hidden'>
                  <Popover>
                    <PopoverTrigger>
                      <EllipsisVertical size={24} />
                    </PopoverTrigger>
                    <PopoverContent className='w-[144px] mr-4'>
                      <div className='gap-2 flex flex-row items-center justify-center'>
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
                                <Button onClick={() => handleExclude(user.user_id, confirmation)} style={{ flexGrow: 1, padding: '25px 40px', borderRadius: 100 }} className="text-[18px] font-semibold ">Excluir usuário</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <UserEditForm id={user.user_id} refetch={refetch} defaultValue={user} />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>


      </Table>
     
    </Card>
  )
}
