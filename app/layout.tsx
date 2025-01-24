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
      path: '../public/fonts/SFPRODISPLAYBLACKITALIC.otf',
      weight: '900',
      style: 'italic'
    },
    {
      path: '../public/fonts/SFPRODISPLAYBOLD.otf',
      weight: '700',
      style: 'normal'
    },
    {
      path: '../public/fonts/SFPRODISPLAYHEAVYITALIC.otf',
      weight: '800',
      style: 'italic'
    },
    {
      path: '../public/fonts/SFPRODISPLAYLIGHTITALIC.otf',
      weight: '300',
      style: 'italic'
    },
    {
      path: '../public/fonts/SFPRODISPLAYMEDIUM.otf',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../public/fonts/SFPRODISPLAYREGULAR.otf',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../public/fonts/SFPRODISPLAYSEMIBOLDITALIC.otf',
      weight: '600',
      style: 'italic'
    },
    {
      path: '../public/fonts/SFPRODISPLAYTHINITALIC.otf',
      weight: '100',
      style: 'italic'
    },
    {
      path: '../public/fonts/SFPRODISPLAYULTRALIGHTITALIC.otf',
      weight: '200',
      style: 'italic'
    },
  ],
  variable: '--font-sfpro'
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body className={`${sfpro.variable}`}>
        <ReactQueryProvider>
        {children}
          </ReactQueryProvider>
      </body>
    </html>
  )
}
