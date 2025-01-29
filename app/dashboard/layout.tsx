'use client'
import React, { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation'
import { getUser } from '@/hooks/user';

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"


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
        <SidebarProvider>
            <div className='bg-background w-full flex'>
                <AppSidebar />
                <SidebarTrigger />
                <div style={{ paddingTop: 20, }} className='container mx-auto flex'>
                    {children}
                </div>
            </div>
        </SidebarProvider>

    )
}