import { fetchApi, fetchWithAuth,  } from "@/hooks/api";
import { createToken } from "@/hooks/token";
import { RegisterUser, UserList, LoginUser } from "./types";
import { createUser } from "@/hooks/user";

export const registerUser = async (data: RegisterUser) => {
    try {
        const res: any = await fetchWithAuth("/api/auth/register", { method: "POST", data: data });
        return res;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const loginUser = async (email: string, password: string, session: boolean) => {
    try {
        const res: LoginUser = await fetchApi("/api/auth/login", { method: "POST", data: { email, password } });
        await createToken(res.token, session);
        await createUser(res.user, session);
        return res;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
};

export const listUsers = async (page: number): Promise<UserList[]> => {
    try {
        const res: UserList[] = await fetchWithAuth("/users", { method: "GET" });
        return res;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
};

export const excludeUser = async (id: string) => {
    try {
        const res: any = await fetchWithAuth("/api/auth/deleteUser", { method: "DELETE", data: { id: id } });
        return res.data;
    } catch (error) {
        console.log(error)
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
};

