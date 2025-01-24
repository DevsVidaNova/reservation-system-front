import type { Metadata } from 'next'
import './globals.css'
import './font.css'
import ReactQueryProvider from '../lib/provider';

export const metadata: Metadata = {
  title: 'Agendar Consulta',
  description: 'Created with v0',
}

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body className='font-sfpro'>
        <ReactQueryProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
/* SIDEBAR DENTRO DO PROVIDER
  <AppSidebar />
            <SidebarTrigger />
*/