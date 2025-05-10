'use client'
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Clock, EllipsisVertical, MapPin, Phone, Trash } from 'lucide-react';

import { ListMember, SingleMember } from '../../app/__api/types';
import { MemberAddForm } from './member-add';
import { deleteMember } from '../../app/__api/members';


import {
  Button,
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/"
import { MemberEditForm } from './member-edit';


export function MemberList({ users, refetch, handleNext, handlePrevious, page }: { users: SingleMember[], refetch: () => void, handleNext: () => void, handlePrevious: () => void, page: number }) {
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
          <TableUsers handleNext={handleNext} handlePrevious={handlePrevious} page={page} users={users || []} refetch={refetch} />
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 50, left: '50%', transform: 'translateX(-50%)' }} className='justify-center items-center md:hidden'>
        <MemberAddForm refetch={refetch} />
      </div>
    </>
  )
}

const TableUsers = ({ users, refetch, handleNext, handlePrevious, page }: { users: SingleMember[], refetch: () => void, handleNext: () => void, handlePrevious: () => void, page: number }) => {
  if (!users) return <p>Carregando...</p>

  const handleExclude = async (id: string) => {
    try {
      await deleteMember(id)
      refetch()
    } catch (error: any) {
      console.log(error)
    }
  }

  const CardMember = ({ user }: { user: SingleMember }) => {
    return (
      <TableRow key={user.email}>
        <TableCell className='text-[12px] md:text-[18px] leading-none font-medium'>{user.full_name}</TableCell>
        <TableCell className='text-[12px] md:text-[18px] leading-none font-medium'>{user.phone}</TableCell>
        <TableCell className='text-wrap min-w-[60px] text-[12px] md:text-[18px] leading-none font-medium' style={{ wordBreak: 'break-word' }}>{user.email}</TableCell>
        <TableCell className=''>
          <div className=' md:flex hidden gap-3 flex-row '>
            <Button onClick={() => handleExclude(user.id)} variant='outline' className='w-[38px] h-[42px] rounded-lg'>
              <Trash size={24} />
            </Button>
            <MemberEditForm id={user.id} refetch={refetch} defaultValues={user} />
          </div>
          <div className='block md:hidden'>
            <Popover>
              <PopoverTrigger>
                <EllipsisVertical size={24} />
              </PopoverTrigger>
              <PopoverContent className='w-[144px] mr-4'>
                <div className='gap-2 flex flex-row items-center justify-center'>
                  <Button onClick={() => handleExclude(user.id)} variant='outline' className='w-[38px] h-[42px] rounded-lg'>
                    <Trash size={24} />
                  </Button>
                  <MemberEditForm id={user.id} refetch={refetch} defaultValues={user} />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <Card className='overflow-hidden mb-30'>
      <Table className='border-b'>
        <TableHeader >
          <TableRow className='opacity-70'>
            <TableHead >Nome</TableHead>
            <TableHead >Telefone</TableHead>
            <TableHead className='text-wrap min-w-[60px] '>Email</TableHead>
            <TableHead >Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user: any, index) => (
            <CardMember user={user} key={index} />
          ))}
        </TableBody>
      </Table>
      <Pagination className='py-2 '>
        <PaginationContent className='gap-2'>
          <PaginationItem onClick={handlePrevious} className='h-10 w-10 justify-center items-center border rounded-md flex bg-accent cursor-pointer'>
            <ArrowLeft size={18} />
          </PaginationItem>
          <PaginationItem className='bg-black text-white rounded-md'>
            <PaginationLink >{page}</PaginationLink>
          </PaginationItem>
          <PaginationItem onClick={handleNext} className='h-10 w-10 justify-center items-center border rounded-md flex bg-accent cursor-pointer'>
            <ArrowRight size={18} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </Card>
  )
}