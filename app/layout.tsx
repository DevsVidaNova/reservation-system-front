import type { Metadata } from 'next'
import './globals.css'
import './font.css'
import ReactQueryProvider from '../lib/provider';

import Link from 'next/link'
export const metadata: Metadata = {
  title: 'Vida Nova | Reservar Espaço',
  description: 'Reserve um horário para atendimento no Espaço Vida Nova',
}

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body className='font-mundial'>
        <ReactQueryProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
