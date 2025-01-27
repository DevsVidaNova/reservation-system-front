'use client';
import { useEffect, useState } from "react";
import { BookingList } from "@/components/booking-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getUser } from "@/hooks/user";
export default function Home() {
  const [user, setuser] = useState();
  useEffect(() => {
    const verify = async () => {
      const res: any = await getUser();
      console.log(res)
      setuser(res);
    }
    verify();
  }, []);
  return (
    <div className="container mx-auto py-10 px-4 sm:px-2">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold mb-6">Reservar Espaço</h1>
          {user?.isAdmin &&
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
      <BookingList logged={user ? true : false} />
      </div>
      )
}

