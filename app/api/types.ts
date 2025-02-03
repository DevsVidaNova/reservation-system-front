
//USER TYPES
export type UserList = {
    email: string;
    phone: string;
    name: string;
    _id: string;
};
export type UserEdit = {
    email: string;
    phone: string;
    name: string;
    _id: string;
    password: string;
};
export type RegisterUser = {
    email: string;
    password: string;
    phone: string;
    name: string;
};


export type CreateBooking = {
    description: string,
    room: string,
    date: string,
    startTime: string,
    endTime: string,
}
export type Booking = { 
    description: string,
    room: string,
    date: string,
    startTime: string,
    endTime: string,
    user: any,
    _id: string,
}


export type Room = {
    _id: string, //id da sala
    name: string, //nome da sala
    size: number, //quantidade de pessoas
    description: string, //ex: sala de reunião
    exclusive: boolean, //exclusivo ou não
    status: boolean,  //ativo ou não
} 
export type RoomAdd = {
    name: string, //nome da sala
    size: number, //quantidade de pessoas
    description: string, //ex: sala de reunião
    exclusive: boolean, //exclusivo ou não
    status: boolean,  //ativo ou não
}


export type LoginUser = {
    message: string;
    user: {
        email: string;
        id: string;
        isAdmin: boolean;
    };
    token: string;
}
export type Stats = {
    rooms: number, //quantidade de salas
    bookings: number, //quantidade de reservas
    users: number, //quantidade de usuários
    week: number, //quantidade de reservas para a semana
}