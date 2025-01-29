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
import { BookCheck, Calendar, Camera, Home, Inbox, Lightbulb, LogOut, Search, Settings, User, Users } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from 'next/navigation'
import { deleteToken } from '@/hooks/token';
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const { setTheme, theme } = useTheme()

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
            url: "/dashboard",
            icon: <Home />,
        },
        {
            title: "Reservas",
            url: "/",
            icon: <Calendar />,
        },
        {
            title: "Salas",
            url: "/dashboard/rooms",
            icon: <BookCheck />,
        },
        {
            title: "Usuários",
            url: "/dashboard/users",
            icon: <Users />,
        },
        {
            title: "Meu Perfil",
            url: "/dashboard/profile",
            icon: <User />,
        },
        {
            title: "Sair",
            icon: <LogOut />,
            handle: () => handleLogout(),
        },
    ]

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }
    return (
        <Sidebar >
            <SidebarHeader className="bg-background">
                <Link href="/" className="text-xl font-bold ml-2">
                    <div className='flex-row flex align-center justify-center items-center'>
                        <img src={theme =='dark' ? "/imgs/logo_white.png": "/imgs/logo_black.png"} alt="VIDA NOVA" className="w-[180px]" />
                    </div>
                </Link>
            </SidebarHeader>
            <SidebarContent className="bg-background">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="">
                            {items?.map((item: any) => (
                                <SidebarMenuItem key={item.title} >
                                    <SidebarMenuButton asChild className={`flex-row flex text-[16px] transition  ${pathname == item.url ? 'bg-muted text-primary font-semibold' : 'bg-background text-primary opacity-60'}`} >
                                        <a href={item.url ? item.url : '#'} onClick={item?.handle ? item?.handle : null} className="py-5 px-4">
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <Button onClick={toggleTheme} variant='outline' className="w-[46px] h-[46px] fixed bottom-4 left-4">
                    {theme === 'dark' ? <Sun size={18} color='#fff' /> : <Moon size={18} color='#000' />}
                </Button>
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