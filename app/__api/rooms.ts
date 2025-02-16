import { fetchApi, fetchWithAuth, } from "@/hooks/api";
import { ListRoom, CreateRoom, } from "./types";

export const listRooms = async (): Promise<ListRoom[]> => {
    try {
        const res = await fetchApi<ListRoom[]>("/room", { method: "GET" });
        return res;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};

export const singleRoom = async (id: string): Promise<ListRoom> => {
    try {
        const res = await fetchApi<ListRoom>("/room/" + id, { method: "GET", });
        return res;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};

export const addRoom = async (data: CreateRoom): Promise<CreateRoom> => {
    try {
        const res = await fetchWithAuth<CreateRoom>("/room", { method: "POST", data: data });
        return res;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};

export const editRoom = async (id: string, data: CreateRoom): Promise<CreateRoom> => {
    try {
        const res: any = await fetchWithAuth(`/room/${id}`, { method: "PUT", data: data });
        return res;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};

export const deleteRoom = async (id: string) => {
    try {
        const res: any = await fetchWithAuth(`/room/${id}`, { method: "DELETE" });
        return res;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};

export const searchRoom = async (name: string): Promise<ListRoom> => {
    try {
        const res = await fetchApi<ListRoom>("/room/search", {
            method: "POST",
            data: {
                name: name
            }
        });
        return res;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};