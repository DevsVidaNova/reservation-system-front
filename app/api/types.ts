export type UserList = {
    email: string;
    phone: string;
    name: string;
    _id: string;
};

export type RegisterUser = {
    email: string;
    password: string;
    phone: string;
    name: string;
};

export type LoginUser = {
    message: string;
    user: {
        email: string;
        id: string;
        isAdmin: boolean;
    };
    token: string;
}

export type Booking = { 
    name: string,
    phone: string,
    room: string,
    date: string,
    startTime: string,
    endTime: string,
}