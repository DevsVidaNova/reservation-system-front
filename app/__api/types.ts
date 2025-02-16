
//BOOKING
export type CreateBooking = {
    description: string,
    room: string,
    date?: string | undefined | Date,
    start_time: string,
    end_time: string,
    repeat?: string | undefined | null,
    day_repeat?: number | string | undefined | null,
}

export type ListBooking = {
    id: number,
    description: string,
    room: {
        id: string,
        name: string,
        size: string,
    },
    date: string,
    start_time: string,
    end_time: string,
    user: {
        id: string,
        name: string,
        email: string,
        phone: string | null
    },
    repeat: string | null,
    day_repeat: number |  null | string,
}

//ROOM
export interface ListRoom {
    id: string, //id da sala
    name: string, //nome da sala
    size: string, //quantidade de pessoas
    description: string, //ex: sala de reunião
    exclusive: boolean, //exclusivo ou não
    status: boolean,  //ativo ou não
    created_at: string, //data de criação
}
export interface CreateRoom {
    name: string, //nome da sala
    size: number, //quantidade de pessoas
    description: string, //ex: sala de reunião
    exclusive: boolean, //exclusivo ou não
    status: boolean,  //ativo ou não
}

//SCALE
export interface ListScale {
    id: string,
    name: string,
    date: string,
    direction: {
        name: string
    },
    confirmations: number
}
interface Person {
    id: string;
    name: string;
    phone: string|null;
    email: string;
    confirmed: boolean;
}
interface ScaleConfirmation {
    user_id: string;
    confirmed: boolean;
}
export interface SingleScale {
    date: string;
    id: string;
    name: string;
    band: Person | Person[] | null;
    projection: Person | Person[] | null;
    light: Person | Person[] | null;
    transmission: Person | Person[] | null;
    camera: Person | Person[] | null;
    live: Person | Person[] | null;
    sound: Person | Person[] | null;
    training_sound: Person | Person[] | null;
    photography: Person | Person[] | null;
    stories: Person | Person[] | null;
    dynamic: Person | Person[] | null;
    direction: Person | Person[] | null;
    scale_confirmations: ScaleConfirmation[];
    percentage_confirmed: string;
}
export interface CreateScale { 
    name: string,
    date: string,
    direction: string|null|undefined,
    band?: string|null|undefined,
    projection?: string|null|undefined,
    sound?: string | null | undefined,
    light?: string | null | undefined,
    transmission?: string | null | undefined,
    camera?: string | null | undefined,
    live?: string | null | undefined,
    training_sound?: string | null | undefined,
    photography?: string | null | undefined,
    stories?: string | null | undefined,
    dynamic?: string | null | undefined,
}
export interface ConfirmScale {
    scale_id: string,
    confirmed: boolean
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
export type Analytics = {
    rooms: number, //quantidade de salas
    bookings: number, //quantidade de reservas
    users: number, //quantidade de usuários
    week: number, //quantidade de reservas para a semana
}

//USER TYPES
export type ListUser = {
    id: string;
    name: string;
    role: string;
    user_id: string;
    phone: string;
    email: string;
};

export type EditUser = {
    phone: string;
    name: string;
};

export type CreateUser = {
    name: string;
    phone: string;
    email: string;
    password: string;
    role?: string;
};

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
