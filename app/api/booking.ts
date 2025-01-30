import { fetchApi, fetchWithAuth,  } from "@/hooks/api";
import { Booking } from "./types";


export const listBookings = async () => {
    try {
        const res: any = await fetchApi("/bookings", { method: "GET",});
        return res;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const addBooking = async (data: Booking) => {
    try {
        const res: any = await fetchWithAuth("/bookings", { method: "POST", data: data });
        console.log(res)
        return res;
    } catch (error: any) {
        console.log(error)
        throw new Error(error.message);
    }
};
export const editBooking = async (id: string, data: Booking) => {
    try {
        const res: any = await fetchWithAuth("/bookings/"+id, { method: "PUT", data: data });
        return res;
    } catch (error: any) {
        console.log(error)
        throw new Error(error.message);
    }
};


export const userBookings = async (id: string) => {
    try {
        const res: any = await fetchWithAuth("/bookings", { method: "GET", data: {_id: id} });
        return res;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const deleteBooking = async (id: string) => {
    try {
        const res: any = await fetchWithAuth("/bookings/deleteBooking/"+id, { method: "DELETE" });
        return res;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
