import { fetchWithAuth } from "@/hooks/api";
import { EditUser, ListUser, CreateUser } from "./types";

export const createUser = async (data: CreateUser): Promise<CreateUser> => {
    try {
        const res = await fetchWithAuth<CreateUser>("/user", { method: "POST", data: data });
        return res;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
};
export const listUsers = async (): Promise<ListUser[]> => {
    try {
        const res = await fetchWithAuth<ListUser[]>("/user", { method: "GET" });
        return res;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
};
export const showUserById = async (id: string): Promise<ListUser> => {
    try {
        const res = await fetchWithAuth<ListUser>("/user/" + id, { method: "GET", });
        return res;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
}
export const editUserById = async (id: string, data: EditUser): Promise<EditUser> => {
    try {
        const res = await fetchWithAuth<EditUser>(`/user/${id}`, { method: "PUT", data: data });
        return res;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
};
export const excludeUserById = async (id: string) => {
    try {
        const res = await fetchWithAuth(`/user/${id}`, { method: "DELETE" });
        return res;
    } catch (error) {
        console.log(error)
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
};