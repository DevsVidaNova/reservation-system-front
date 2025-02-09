"use client"
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, } from "@/components/ui/card"
import { useQuery } from '@tanstack/react-query'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { EllipsisVertical, Trash } from 'lucide-react'
import { Input } from '@/components/ui/input'

import { Room } from '@/app/api/types'
import { deleteRoom, listRooms } from '@/app/api/rooms'
import { RoomAddForm } from '@/components/room/room-add'
import { RoomEditForm } from '@/components/room/room-edit'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function Rooms() {
  const [page, setpage] = useState(1);
  const { data: rooms, error, isLoading, refetch } = useQuery<Room[]>({
    queryKey: ['list rooms'],
    queryFn: async () => {
      const res = await listRooms(page);
      return res;
    },
  });
  useEffect(() => {
    if (page > 1) {
      refetch()
    }
  }, [page])

  if (isLoading) return <div className="flex flex-col container w-full px-6 py-4"><p>Carregando...</p></div>
  if (error) return <div className="flex flex-col container w-full px-6 py-4"><p>Erro ao carregar usuários</p></div>

  return (
    <div className="flex flex-col container w-full px-3 py-4">
      <ListRooms rooms={rooms || []} refetch={refetch} setpage={setpage} page={page} />
    </div>
  )
}

const ListRooms = ({ rooms, refetch, setpage, page }: { rooms: Room[], refetch: () => void, setpage: (page: number) => void; page: number, }) => {
  return (
    <>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-row justify-between items-center'>
          <h2 className='text-[24px] font-bold'>Salas cadastradas</h2>
          <div className='md:block hidden'>
            <RoomAddForm refetch={refetch} />
          </div>
        </div>
        <div>
          <TableRooms rooms={rooms || []} refetch={refetch} page={page} setpage={setpage} />
          <div className='h-[120px]'></div>
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 50, left: '50%', transform: 'translateX(-50%)' }} className='justify-center items-center md:hidden'>
        <RoomAddForm refetch={refetch} />
      </div>
    </>
  )
}

const TableRooms = ({ rooms, refetch, setpage, page }: { rooms: Room[], refetch: () => void, setpage: (page: number) => void; page: number, }) => {
  if (!rooms) return <p>Carregando...</p>

  const [confirmation, setconfirmation] = useState('');
  const [openExclude, setOpenExclude] = useState(false)

  const handleExcludeUser = async (id: string, confirmation: string) => {
    if (confirmation !== 'sim') {
      return
    }
    try {
      await deleteRoom(id)
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
            <TableHead >Ocupação</TableHead>
            <TableHead className='text-wrap min-w-[60px] '>Descrição</TableHead>
            <div className='md:flex hidden flex-row'>
              <TableHead className='text-wrap min-w-[60px] pt-[14px]'>Exclusivo</TableHead>
              <TableHead className='text-wrap min-w-[60px] pt-[14px]'>Status</TableHead>
            </div>
            <TableHead >Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms?.map(room => {
            const { _id, name, size, description, exclusive, status, } = room
            return (
              <TableRow key={_id}>
                <TableCell className='text-[12px] md:text-[18px] leading-none'>{name}</TableCell>
                <TableCell className='text-[12px] md:text-[18px] leading-none'>{size}</TableCell>
                <TableCell className='text-wrap min-w-[60px] text-[12px] md:text-[18px] leading-none' style={{ wordBreak: 'break-word' }}>{description?.length > 100 ? description.slice(0, 97) + '...' : description}</TableCell>
                <div className='md:flex hidden flex-row text-center items-center justify-center'>
                  <TableCell className=' text-[12px] md:text-[18px] leading-none md:flex hidden'>{exclusive ? 'Exclusivo' : 'Livre'}  </TableCell>
                  <TableCell className=' text-[12px] md:text-[18px] leading-none md:flex hidden'>{status ? 'Ativo' : 'Desativado'}</TableCell>
                </div>
                <TableCell>
                  <div className='md:block hidden'>
                    <div className='flex flex-row gap-2'>
                      <Dialog open={openExclude} onOpenChange={setOpenExclude}>
                        <DialogTrigger asChild >
                          <Button variant='outline' className='w-[38px] h-[42px] rounded-lg'>
                            <Trash size={24} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[455px]">
                          <DialogHeader>
                            <DialogTitle>Excluir sala</DialogTitle>
                            <DialogDescription>Tem certeza que quer excluir a sala? Digite "sim" para confirmar</DialogDescription>
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
                              <Button onClick={() => handleExcludeUser(_id, confirmation)} style={{ flexGrow: 1, padding: '25px 40px', borderRadius: 100 }} className="text-[18px] font-semibold ">Excluir sala</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <RoomEditForm id={_id} refetch={refetch} defaultValues={room} />
                    </div>
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
                                <DialogTitle>Excluir sala</DialogTitle>
                                <DialogDescription>Tem certeza que quer excluir a sala? Digite "sim" para confirmar</DialogDescription>
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
                                  <Button onClick={() => handleExcludeUser(_id, confirmation)} style={{ flexGrow: 1, padding: '25px 40px', borderRadius: 100 }} className="text-[18px] font-semibold ">Excluir sala</Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <RoomEditForm id={_id} refetch={refetch} defaultValues={room} />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

    </Card>
  )
}
/*
 <div className='flex flex-row w-full border-t px-2 py-2 items-center gap-2 justify-center'>
        <div className='border rounded-lg text-[16px] w-[42px] h-[42px] items-center justify-center flex flex-col cursor-pointer' onClick={() => setpage(page == 1 ? 1 : page - 1)}>{page - 1}</div>
        <div className='bg-primary text-background rounded-lg text-[16px] w-[42px] h-[42px] items-center justify-center flex flex-col cursor-pointer'  >{page}</div>
        <div className='border rounded-lg text-[16px] w-[42px] h-[42px] items-center justify-center flex flex-col cursor-pointer' onClick={() => setpage(page + 1)} >{page + 1}</div>
      </div>
*/