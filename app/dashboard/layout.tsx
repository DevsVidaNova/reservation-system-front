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
import { AppSidebar } from '@/components/sidebar';

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
      <div className='flex flex-row z-20 bg-[#ffffff30] backdrop-blur-sm fixed left-0 right-0 top-0 bg-background px-4 py-0 border-b'>
        <Drawer>
          <div className='container justify-between items-center flex-row flex'>
            <Link href="/" className='flex flex-col '>
            <img src="/imgs/logo_black.png" className="w-[220px] h-[60px] bg-gray self-center items-center -ml-8" />
            </Link>
            <DrawerTrigger>
              <div className="w-[48px] h-[48px] border rounded-full flex-col flex items-center justify-center">
                <AlignJustify size={24} />
              </div>
            </DrawerTrigger>
          </div>
          <DrawerContent >
            <AppSidebar />
            <DrawerFooter className="px-6 border-t pt-4 mt-4">
              <DrawerClose>
                <Button variant="secondary" className="w-full">Fechar</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <div className='container mx-auto flex pt-[60px]'>
        {children}
      </div>
    </div>
  )
}