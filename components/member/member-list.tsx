'use client'
import { useState } from 'react';
import { Calendar, Clock, EllipsisVertical, MapPin, Phone, Trash } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ListMember } from '../../app/__api/types';
import { MemberAddForm } from './member-add';
import { deleteMember } from '../../app/__api/members';


import {
  Button,
  Input,
  DialogTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  PopoverContent,
  PopoverTrigger,
  Popover,
  Card,
  Table,
  TableRow,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/"
import { MemberEditForm } from './member-edit';


export function MemberList({ users, refetch, }: { users: ListMember[], refetch: () => void, }) {
  return (
    <>
      <div className=' flex flex-col  gap-4'>
        <div className='flex flex-row justify-between items-center'>
          <h2 className='md:text-[28px] text-[22px] font-bold'>Membros cadastrados</h2>
          <div className='md:block hidden'>
            <MemberAddForm refetch={refetch} />
          </div>
        </div>
        <div>
          <TableUsers users={users || []} refetch={refetch} />
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 50, left: '50%', transform: 'translateX(-50%)' }} className='justify-center items-center md:hidden'>
        <MemberAddForm refetch={refetch} />
      </div>
    </>
  )
}

const TableUsers = ({ users, refetch, }: { users: ListMember[], refetch: () => void, }) => {
  if (!users) return <p>Carregando...</p>

  const [confirmation, setconfirmation] = useState('');
  const [openExclude, setOpenExclude] = useState(false)

  const handleExclude = async (id: string, confirmation: string) => {
    if (confirmation !== 'sim') {
      return
    }
    try {
      await deleteMember(id)
      refetch()
    } catch (error: any) {
      console.log(error)
    }
  }

  const CardMember = ({ user }: { user: ListMember }) => {
    return (
      <TableRow key={user.email}>
        <TableCell className='text-[12px] md:text-[18px] leading-none font-medium'>{user.full_name}</TableCell>
        <TableCell className='text-[12px] md:text-[18px] leading-none font-medium'>{user.phone}</TableCell>
        <TableCell className='text-wrap min-w-[60px] text-[12px] md:text-[18px] leading-none font-medium' style={{ wordBreak: 'break-word' }}>{user.email}</TableCell>
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
                    <Button onClick={() => handleExclude(user.id, confirmation)} style={{ flexGrow: 1, padding: '25px 40px', borderRadius: 100 }} className="text-[18px] font-semibold ">Excluir usuário</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <MemberEditForm id={user.id} refetch={refetch} defaultValue={user} />
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
                          <Button onClick={() => handleExclude(user.id, confirmation)} style={{ flexGrow: 1, padding: '25px 40px', borderRadius: 100 }} className="text-[18px] font-semibold ">Excluir usuário</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <MemberEditForm id={user.id} refetch={refetch} defaultValue={user} />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </TableCell>
      </TableRow>
    )
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
          {users?.map((user, index) => (
            <CardMember user={user} key={index} />
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}