'use client';
import { useEffect, useState } from "react";
import { BookingList } from "@/components/booking-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getUser } from "@/hooks/user";

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

export default function Home() {
  const [user, setuser] = useState({ isAdmin: false });
  useEffect(() => {
    const verify = async () => {
      const res: any = await getUser();
      setuser(res);
    }
    verify();
  }, []);

  return (
    <div className="container mx-auto py-2 px-4 sm:px-2">
      <img src="/imgs/logo_black.png" alt="Vida Nova" className="w-[180px] md:hidden block self-center items-center mx-auto" />
      <div className="flex flex-row justify-between mb-6 align-center items-center pb-4">
        <img src={"/imgs/logo_black.png"} alt="Vida Nova" className="w-[180px] md:block hidden" />
        <h1 className="text-[24px] font-bold " style={{ lineHeight: 1, }}>Reservar Espaço</h1>
        <div>

          <Drawer>
            <DrawerTrigger>
              <AlignJustify size={24} />
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>O que deseja fazer?</DrawerTitle>
                <DrawerDescription>Clique em um dos botões abaixo ou arraste esse componente para baixo.</DrawerDescription>
              </DrawerHeader>

              <div className="w-full flex-col flex gap-4 px-6">
              {user &&
                <Link href="/dashboard" >
                  <Button  className="w-full">
                    Painel de Controle
                  </Button>
                </Link>}
              {!user &&
                <Link href="/auth/login">
                  <Button className="w-full">
                    Fazer Login
                  </Button>
                </Link>
                }
                <Link href="/dashboard" >
                  <Button  className="w-full" variant='outline' >
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
      </div>
      <BookingList />
    </div>
  )
}

