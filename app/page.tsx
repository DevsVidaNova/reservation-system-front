'use client';
import { useEffect, useState } from "react";
import { BookingList } from "@/components/booking-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getUser } from "@/hooks/user";
import { useTheme } from "next-themes";

export default function Home() {
  const [user, setuser] = useState({ isAdmin: false });
  useEffect(() => {
    const verify = async () => {
      const res: any = await getUser();
      setuser(res);
    }
    verify();
  }, []);
  const { theme } = useTheme()

  return (
    <div className="container mx-auto py-2 px-4 sm:px-2">
       <img src="/imgs/logo_black.png" alt="Vida Nova" className="w-[180px] md:hidden block self-center items-center mx-auto" />
      <div className="flex flex-row justify-between mb-6 align-center items-center pb-4">
        <img src={theme =='dark' ? "/imgs/logo_white.png": "/imgs/logo_black.png"} alt="Vida Nova" className="w-[180px] md:block hidden" />
        <h1 className="text-[24px] font-bold " style={{lineHeight: 1,}}>Reservar Espaço</h1>
        <div>
          {user &&
            <Link href="/dashboard">
              <Button variant='outline' >
                Dashboard
              </Button>
            </Link>}
          {!user &&
            <Link href="/auth/login">
              <Button variant='outline'>
                Acessar conta
              </Button>
            </Link>
          }
        </div>
      </div>
      <BookingList logged={user ? true : false} admin={user?.isAdmin ? true : false} />
    </div>
  )
}

