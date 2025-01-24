import { BookingList } from "@/components/booking-list"
export default function Home() {
  return (
    <div className="container mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6">Reservar Espaço Vida Nova</h1>
      <BookingList />
    </div>
  )
}

