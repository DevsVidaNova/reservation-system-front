import { AlarmClockCheck, BookCheck, Calendar, CalendarRange, Captions, Home, LogOut, Users } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from 'next/navigation'
import { deleteToken } from '@/hooks/token';
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { deleteUser } from "@/hooks/user";

export function AppSidebar() {
    const pathname = usePathname()
    const { setTheme, theme } = useTheme()

    const router = useRouter()
    const handleLogout = () => {
        try {
            deleteToken();
            deleteUser();
            router.replace('/')
        } catch (error) {
            console.log(error);
        }
    }
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }
    const items = [
        {
            title: "Início",
            url: "/dashboard",
            icon: <Home />,
        },
        {
            title: "Reservas",
            url: "/dashboard/bookings",
            icon: <Calendar />,
        },
        {
            title: "Salas",
            url: "/dashboard/rooms",
            icon: <BookCheck />,
        },
        {
            title: "Escalas",
            url: "/dashboard/scales",
            icon: <Captions />,
        },
        {
            title: "Usuários",
            url: "/dashboard/users",
            icon: <Users />,
        },
        {
            title: "Alterar tema",
            icon: <>{theme === 'dark' ? <Sun size={24} color='#fff' /> : <Moon size={24} color='#000' />}</>,
            handle: () => toggleTheme(),
        },
        {
            title: "Sair",
            icon: <LogOut />,
            handle: () => handleLogout(),
        },
    ]

    
    return (
        <div>
            <div className="bg-background">
                <Link href="/" className="font-bold -mt-6">
                    <div className='flex-row flex align-center justify-center items-center'>
                        <img src={theme == 'dark' ? "/imgs/logo_white.png" : "/imgs/logo_black.png"} alt="VIDA NOVA" className="w-[180px]" />
                    </div>
                </Link>
            </div>
            <div className="bg-background">
                <div className="flex flex-col px-4">
                    {items?.map((item: any) => (
                            <a href={item.url ? item.url : '#'} onClick={item?.handle ? item?.handle : null} className="">
                        <div key={item.title} className={`flex-row flex text-[16px] py-4 px-4 rounded-lg transition w-full  ${pathname == item.url ? 'bg-muted text-primary font-semibold' : 'bg-background text-primary opacity-60'}`} >
                                <div className="flex flex-row w-full gap-2">
                                    {item.icon}
                                    <span className="text-[16px] font-semibold">{item.title}</span>
                                </div>
                        </div>
                            </a>
                    ))}
                </div>
            </div>
        </div>
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