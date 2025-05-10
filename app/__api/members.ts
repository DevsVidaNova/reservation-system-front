import { fetchWithAuth, } from "@/hooks/api";
import { ListMember, CreateMember, Pagination, SingleMember } from "./types";

export const listMembers = async (page: number): Promise<{ members: SingleMember[]; pagination: Pagination }> => {
    try {
        const res = await fetchWithAuth<{ members: SingleMember[]; pagination: Pagination }>(`/members?page=${page}`, { method: "GET" });
        return res;
    } catch (error: any) {
        console.log(error)
        throw new Error(error.message);
    }
};

export const singleMember = async (id: string): Promise<ListMember> => {
    try {
        const res = await fetchWithAuth<ListMember>("/members/" + id, { method: "GET", });
        return res;
    } catch (error: any) {
        console.log(error)
        throw new Error(error.message);
    }
};

export const addMember = async (data: CreateMember): Promise<CreateMember> => {
    try {
        const res = await fetchWithAuth<CreateMember>("/members", { method: "POST", data: data });
        return res;
    } catch (error: any) {
        console.log(error)
        throw new Error(error.message);
    }
};

export const editMember = async (id: string, data: CreateMember): Promise<CreateMember> => {
    try {
        const res = await fetchWithAuth<CreateMember>(`/members/${id}`, { method: "PUT", data: data });
        return res;
    } catch (error: any) {
        console.log(error)
        throw new Error(error.message);
    }
};

export const deleteMember = async (id: string) => {
    try {
        const res = await fetchWithAuth(`/members/${id}`, { method: "DELETE" });
        return res;
    } catch (error: any) {
        console.log(error)
        throw new Error(error.message);
    }
};

export const searchMember = async (name: string): Promise<ListMember> => {
    try {
        const res = await fetchWithAuth<ListMember>("/members/search", {
            method: "POST",
            data: {
                name: name
            }
        });
        return res;
    } catch (error: any) {
        console.log(error)
        throw new Error(error.message);
    }
};

export const filterMember = async (name: string): Promise<ListMember> => {
    try {
        const res = await fetchWithAuth<ListMember>("/members/filter", {
            method: "POST",
            data: {
                name: name
            }
        });
        return res;
    } catch (error: any) {
        console.log(error)
        throw new Error(error.message);
    }
};

export const getMembersAnalytics = async (): Promise<any> => {
    try {
        const res = await fetchWithAuth<any>("/members/analytics", {
            method: "GET",
        });
        return res;
    } catch (error: any) {
        console.log(error)
        throw new Error(error.message);
    }
};