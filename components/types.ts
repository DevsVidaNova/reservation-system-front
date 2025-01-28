export interface Booking {
    _id: string
    room: string
    date: string
    startTime: string
    endTime: string,
    description: string,
    user: {
        name: string,
        phone: string,
        _id: string
    }
}