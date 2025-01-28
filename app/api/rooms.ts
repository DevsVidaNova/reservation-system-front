import { fetchApi, fetchWithAuth,  } from "@/hooks/api";
import { Room } from "./types";
export const listRooms = async () => {
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

export const addRooms = async (data: Room) => {
    try {
        const res: any = await fetchWithAuth("/rooms", { method: "POST", data: data });
        return res;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const editRoom = async (id: string, data: Room) => {
    try {
        const res: any = await fetchWithAuth("/rooms/"+id, { method: "POST", data: data });
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
