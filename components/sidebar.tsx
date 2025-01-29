import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { BookCheck, Calendar, Camera, Home, Inbox, Lightbulb, LogOut, Search, Settings, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { useRouter } from 'next/navigation'
import { deleteToken } from '@/hooks/token';

export function AppSidebar() {
    const router = useRouter()
    const handleLogout = () => {
        try {
            deleteToken();
            router.replace('/')
        } catch (error) {
            console.log(error);
        }
    }


    const items = [
        {
            title: "Início",
            url: "dashboard",
            icon: Home,
        },
        {
            title: "Reservas",
            url: "bookings",
            icon: Calendar,
        },
        {
            title: "Salas",
            url: "rooms",
            icon: BookCheck,
        },
        {
            title: "Usuários",
            url: "users",
            icon: Users,
        },
        {
            title: "Sair",
            icon: LogOut,
            handle: handleLogout(),
        },
    ]

    return (
        <Sidebar >
            <SidebarHeader className="bg-[#000]">
                <Link href="/" className="text-xl font-bold ml-2">
                    <div className='flex-row flex align-center justify-center items-center'>
                        <img src="/imgs/logo_white.svg" alt="ProStock" className="w-[180px]" />
                    </div>
                </Link>
            </SidebarHeader>
            <SidebarContent className="bg-[#000]">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-4">
                            {items?.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url ? item.url : '#'} onClick={item?.handle ? item?.handle : null}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}





/*
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
        <Link href="/profile">
            <div style={{ backgroundColor: "#303030", width: 46, height: 46, justifyContent: 'center', alignItems: 'center', borderRadius: 100, flexDirection: 'column', display: 'flex' }}>
                <User size={18} color='#fff' />
            </div>
        </Link>
        <Button style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: '#ffffff30', }} onClick={handleLogout}>
            <LogOut size={18} color='#fff' />
        </Button>
    </div>
</div>
</nav>
*/