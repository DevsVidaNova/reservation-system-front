'use client'
import React, { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deleteToken } from '@/hooks/token';
import { Button } from '@/components/ui/button'
import { ChevronRight, LogOut, Store, User } from 'lucide-react';
import { getUser } from '@/hooks/user';

export default function DashLayout({ children }: { children: ReactNode }) {
    const router = useRouter()
    const handleLogout = () => {
        try {
            deleteToken();
            router.replace('/')
        } catch (error) {
            console.log(error);
        }
    }
    const [user, setuser] = useState();
    useEffect(() => {
        const verify = async () => {
            const res: any = await getUser();
            if (!res) {
                router.replace('/')
            } else {
                setuser(res);
                return; 
            }
        }
        verify();
    }, []);


    return (
        <div className='bg-[#fff] w-full flex'>
            <nav className=" text-white p-2 px-4 fixed w-full z-10" style={{ backgroundColor: '#000', }}>
                <div className="container mx-auto flex justify-between items-center">
                    <div className='flex-row flex'>
                        <Link href="/" className="text-xl font-bold ml-2">
                            <div className='flex-row flex align-center justify-center items-center'>
                                <img src="/imgs/logo_white.svg" alt="ProStock" className="w-[180px]" />
                            </div>
                        </Link>
                    </div>
                    <div className='flex-row flex gap-x-4'>
                        <div style={{ backgroundColor: "#303030", width: 46, height: 46, justifyContent: 'center', alignItems: 'center', borderRadius: 100, flexDirection: 'column', display: 'flex' }}>
                            <User size={18} color='#fff' />
                        </div>
                        <Button style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: '#ffffff30', }} onClick={handleLogout}>
                            <LogOut size={18} color='#fff' />
                        </Button>
                    </div>
                </div>
            </nav>
            <div style={{ paddingTop: 80, }} className='container mx-auto flex'>
                {children}
            </div>
        </div>
    )
}