import { fetchWithAuth } from "@/hooks/api";
import { UserEdit, UserList } from "./types";

//ADMIN
export const listUsers = async (page: number): Promise<UserList[]> => {
    try {
        const res: UserList[] = await fetchWithAuth("/users", { method: "GET" });
        return res;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
};

export const showUserById = async (id: string): Promise<UserEdit> => {
    try {
        const res: UserEdit = await fetchWithAuth("/api/auth/showUserById/"+id, { method: "GET", });
        return res;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
}
export const editUserById = async (id: string, data: any) => {
    try {
        const res = await fetchWithAuth("/api/auth/editUser/", { method: "PUT", data: {id: id, name: data.name, phone: data.phone, email: data.email, password: data.password} });
        return res;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
};
export const excludeUserById = async (id: string) => {
    try {
        const res: any = await fetchWithAuth("/api/auth/deleteUser", { method: "DELETE", data: { id: id } });
        return res;
    } catch (error) {
        console.log(error)
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
};