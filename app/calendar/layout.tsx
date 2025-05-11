import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { CalendarSidebar } from "@/components/calendar/calendar-list"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <CalendarSidebar />
      <main className="overflow-y-hidden h-screen">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
