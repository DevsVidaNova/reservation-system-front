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
import { Calendar, Camera, Home, Inbox, Lightbulb, Search, Settings } from "lucide-react"

const items = [
    {
        title: "Reserva",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Cameras",
        url: "#",
        icon: Camera,
    },
    {
        title: "Luzes",
        url: "#",
        icon: Lightbulb,
    },
    {
        title: "Configurações",
        url: "#",
        icon: Settings,
    },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup >
                    <SidebarGroupLabel className="text-lg">Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-4">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
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
            <SidebarFooter />
        </Sidebar>
    )
}