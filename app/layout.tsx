import type { Metadata } from 'next'
import './globals.css'
import './font.css'
import ReactQueryProvider from '../lib/provider';

export const metadata: Metadata = {
  title: 'Vida Nova | Reservar Espaço',
  description: 'Reserve um horário para atendimento no Espaço Vida Nova',
}

import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (  
    <html lang="pt-br" suppressHydrationWarning>
      <body className='font-mundial'>
      <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
        <ReactQueryProvider>
            {children} 
        </ReactQueryProvider>
      </ThemeProvider>
      </body>
    </html>
  )
}
