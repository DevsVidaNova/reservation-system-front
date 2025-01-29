import { fetchApi, fetchWithAuth,  } from "@/hooks/api";
import { Room, RoomAdd,  } from "./types";

//ALL CHECK
export const listRooms = async (page: number) => {
    try {
        const res: Room[] = await fetchApi("/rooms", { method: "GET" });
        return res;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const showRoom = async (id: string) => {
    try {
        const res: Room = await fetchApi("/rooms/"+id, { method: "GET",});
        return res;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const addRoom = async (data: RoomAdd) => {
    try {
        const res: any = await fetchWithAuth("/rooms", { method: "POST", data: data });
        return res;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const editRoom = async (id: string, data: RoomAdd) => {
    try {
        const res: any = await fetchWithAuth("/rooms/"+id, { method: "PUT", data: data });
        return res;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const deleteRoom = async (id: string) => {
    try {
        const res: any = await fetchWithAuth("/rooms/"+id, { method: "DELETE" });
        return res;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

