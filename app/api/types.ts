
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

//BOOKING
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

//ROOM
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


//TIMELINE
export type Timeline = {
    id: string;
    title: string; //CULTO DE DOMINGO
    description: string; //COM A PRESENÇA DO PASTOR FULANO
    date: string; //24/12/2025
    startTime: string, //19:00
    endTime: string, //21:00
    room: string, //TEMPLO
    status: string, //finished, progress, unstarted
    sections: [
        {
            title: string, //ANTES DO CULTO
            description: string, //ENSAIO DA BANDA
            startTime: string, //18:00
            endTime: string, //19:00
            presentation: string, //DRIVE GOOGLE LINK
            playlist: [
                {
                    title: string, //NADA MAIS - FHOP (ENSAIO)
                    description: string, //FULANO DE TAL, FULANO DE TAL E CICLANO
                    url: string, //https://www.youtube.com/watch?v=N5AMmLZjaaM
                },
                {
                    title: string, //OS QUE OLHAM PARA TI - FHOP (ENSAIO)
                    description: string, //FULANO DE TAL, FULANO DE TAL E CICLANO
                    url: string, //https://www.youtube.com/watch?v=Dv-7mBQNEIo
                },
            ]
        },
        {
            title: string, //PRELÚDIO
            description: string, //LOUVOR COM A BANDA
            startTime: string, //19:00
            endTime: string, //19:20
            presentation: string, //DRIVE GOOGLE LINK
            playlist: [
                {
                    title: string, //NADA MAIS - FHOP
                    description: string, //FULANO DE TAL, FULANO DE TAL E CICLANO
                    url: string, //https://www.youtube.com/watch?v=N5AMmLZjaaM
                },
                {
                    title: string, //OS QUE OLHAM PARA TI - FHOP
                    description: string, //FULANO DE TAL, FULANO DE TAL E CICLANO
                    url: string, //https://www.youtube.com/watch?v=Dv-7mBQNEIo
                },
            ]
        },
        {
            title: string, //CULTO
            description: string, //PREGAÇÃO DO PASTOR FULANO
            startTime: string, //19:20
            endTime: string, //20:45
            presentation: string, //DRIVE GOOGLE LINK
        },
        {
            title: string, //PÓSLÚDIO
            description: string, //AVISOS E DESPEDIDA
            startTime: string, //20:45
            endTime: string, //21:00
            presentation: string, //DRIVE GOOGLE LINK
            playlist: [
                {
                    title: string, //NADA MAIS - FHOP (AO VIVO)
                    description: string, //FULANO DE TAL, FULANO DE TAL E CICLANO
                    url: string, //https://www.youtube.com/watch?v=N5AMmLZjaaM
                },
                {
                    title: string, //OS QUE OLHAM PARA TI -
                    description: string, //FULANO DE TAL, FULANO DE TAL E CICLANO
                    url: string, //https://www.youtube.com/watch?v=Dv-7mBQNEIo
                },
            ]
        }
    ]
}
