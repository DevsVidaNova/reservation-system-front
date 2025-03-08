"use client"
import { useQuery } from '@tanstack/react-query'
import { ListMember,  } from '@/app/__api/types'

import { listMembers } from '../../__api/members'
import { MemberList } from '../../../components/member/member-list'

export default function Members() {
  const { data: users, error, isLoading, refetch } = useQuery<ListMember[]>({
    queryKey: ['members'],
    queryFn: listMembers
  });

  if (isLoading) return <div className="flex flex-col w-full px-4 py-4 container"><p>Carregando...</p></div>
  if (error) return <div className="flex flex-col w-full px-4 py-4 container"><p>Erro ao carregar usuários</p></div>

  return (
    <div className="flex flex-col w-full px-3 py-4 container">
      <MemberList users={users || []} refetch={refetch}  />
    </div>
  )
}

