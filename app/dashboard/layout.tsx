'use client'
import React, { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deleteToken } from '@/hooks/token';
import { Button } from '@/components/ui/button'
import { ChevronRight, LogOut, Store, User } from 'lucide-react';
import { getUser } from '@/hooks/user';

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"


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
        <SidebarProvider>
            <div className='bg-[#fff] w-full flex'>
                <AppSidebar />
                <div style={{ paddingTop: 20, }} className='container mx-auto flex'>
                    {children}
                </div>
            </div>
        </SidebarProvider>

    )
}