'use client'
import React, { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation'
import { getUser } from '@/hooks/user';

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
  import { AlignJustify } from "lucide-react";

  import { Button } from "@/components/ui/button"
import Link from "next/link"
  
export default function DashLayout({ children }: { children: ReactNode }) {
    const router = useRouter()
    
    useEffect(() => {
        const verify = async () => {
            const res: any = await getUser();
            if (!res) {
                router.replace('/')
            } else {
                return;
            }
        }
        verify();
    }, []);

    return (
        <div className='bg-background w-full flex'>
            <div style={{ paddingTop: 20, }} className='container mx-auto flex'>
                {children}
            </div>
            <Drawer direction='left'>
            <DrawerTrigger>
              <div className="w-[48px] h-[48px] border rounded-full flex-col flex items-center justify-center">
                <AlignJustify size={24} />
              </div>
            </DrawerTrigger>
            <DrawerContent className='h-screen'>
              <DrawerHeader>
                <DrawerTitle>O que deseja fazer?</DrawerTitle>
                <DrawerDescription>Clique em um dos botões abaixo ou arraste esse componente para baixo.</DrawerDescription>
              </DrawerHeader>

              <div className="w-full flex-col flex gap-4 px-6">
                <Link href="/dashboard" >
                  <Button className="w-full" variant='outline' >
                    Solicitar acesso
                  </Button>
                </Link>
              </div>
              <DrawerFooter className="px-6 border-t pt-4 mt-4">
                <DrawerClose>
                  <Button variant="secondary" className="w-full">Fechar</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
    )
}