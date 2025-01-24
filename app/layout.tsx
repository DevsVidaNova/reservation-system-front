import type { Metadata } from 'next'
import './globals.css'
import ReactQueryProvider from '../lib/provider';

export const metadata: Metadata = {
  title: 'Agendar Consulta',
  description: 'Created with v0',
}

import localFont from '@next/font/local'

const sfpro = localFont({
  src: [
    {
      path: '../public/fonts/SFPRODISPLAYBLACKITALIC.OTF',
      weight: '900',
      style: 'italic'
    },
    {
      path: '../public/fonts/SFPRODISPLAYBOLD.OTF',
      weight: '700',
      style: 'normal'
    },
    {
      path: '../public/fonts/SFPRODISPLAYHEAVYITALIC.OTF',
      weight: '800',
      style: 'italic'
    },
    {
      path: '../public/fonts/SFPRODISPLAYLIGHTITALIC.OTF',
      weight: '300',
      style: 'italic'
    },
    {
      path: '../public/fonts/SFPRODISPLAYMEDIUM.OTF',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../public/fonts/SFPRODISPLAYREGULAR.OTF',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../public/fonts/SFPRODISPLAYSEMIBOLDITALIC.OTF',
      weight: '600',
      style: 'italic'
    },
    {
      path: '../public/fonts/SFPRODISPLAYTHINITALIC.OTF',
      weight: '100',
      style: 'italic'
    },
    {
      path: '../public/fonts/SFPRODISPLAYULTRALIGHTITALIC.OTF',
      weight: '200',
      style: 'italic'
    },
  ],
  variable: '--font-sfpro'
})
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body className={`${sfpro.variable}`}>
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