"use client"
import { useQuery } from '@tanstack/react-query'
import { SingleMember, Pagination } from '@/app/__api/types'
import { useState } from 'react'
import { listMembers } from '../../__api/members'
import { MemberList } from '../../../components/member/member-list'

export default function Members() {

  const [page, setPage] = useState(1);

  const { data, error, isLoading, refetch } = useQuery<{ members: SingleMember[]; pagination: Pagination }>({
    queryKey: ['members', page],
    queryFn: () => listMembers(page),
  });

  const handleNext = () => {
    if (data && data.pagination && data.pagination.page < data.pagination.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (data && data.pagination && data?.pagination.page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  if (isLoading) return <div className="flex flex-col w-full px-4 py-4 container"><p>Carregando...</p></div>
  if (error) return <div className="flex flex-col w-full px-4 py-4 container"><p>Erro ao carregar usuários</p></div>

  return (
    <div className="flex flex-col w-full px-3 py-4 container">
      <MemberList handlePrevious={handlePrevious} page={page} handleNext={handleNext} users={data?.members || []} refetch={refetch} />
    </div>
  )
}

