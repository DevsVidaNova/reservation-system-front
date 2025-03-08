import { fetchWithAuth, } from "@/hooks/api";
import { ListMember, CreateMember } from "./types";

export const listMembers = async (): Promise<ListMember[]> => {
    try {
        const res = await fetchWithAuth<ListMember[]>("/members", { method: "GET" });
        return res;
    } catch (error) {
        console.log(error)
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};

export const singleMember = async (id: string): Promise<ListMember> => {
    try {
        const res = await fetchWithAuth<ListMember>("/member/" + id, { method: "GET", });
        return res;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};

export const addMember = async (data: CreateMember): Promise<CreateMember> => {
    try {
        const res = await fetchWithAuth<CreateMember>("/member", { method: "POST", data: data });
        console.log(res)
        return res;
    } catch (error) {
        console.log(error)  
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};

export const editMember = async (id: string, data: CreateMember): Promise<CreateMember> => {
    try {
        const res = await fetchWithAuth<ListMember>(`/member/${id}`, { method: "PUT", data: data });
        return res;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};

export const deleteMember = async (id: string) => {
    try {
        const res = await fetchWithAuth(`/member/${id}`, { method: "DELETE" });
        return res;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};

export const searchMember = async (name: string): Promise<ListMember> => {
    try {
        const res = await fetchWithAuth<ListMember>("/member/search", {
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

export const filterMember = async (name: string): Promise<ListMember> => {
    try {
        const res = await fetchWithAuth<ListMember>("/member/filter", {
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