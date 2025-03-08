import { fetchWithAuth, } from "@/hooks/api";
import { ListScale, SingleScale, CreateScale } from "./types";

export const listScales = async (): Promise<ListScale[]> => {
    try {
        const res = await fetchWithAuth<ListScale[]>("/scale", { method: "GET" });
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

export const listMyScales = async (): Promise<ListScale[]> => {
    try {
        const res = await fetchWithAuth<ListScale[]>("/scale/my", { method: "GET" });
        return res;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};

export const singleScale = async (id: string): Promise<SingleScale> => {
    try {
        const res = await fetchWithAuth<SingleScale>("/scale/" + id, { method: "GET", });
        return res;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};

export const duplicateScale = async (id: string): Promise<SingleScale> => {
    try {
        const res = await fetchWithAuth<SingleScale>("/scale/duplicate/" + id, { method: "POST", });
        return res;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};

export const addScale = async (data: CreateScale): Promise<CreateScale> => {
    console.log('adicionando esala')
    try {
        const res = await fetchWithAuth<CreateScale>("/scale", { method: "POST", data: data });
        return res;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};

export const editScale = async (id: string, data: CreateScale): Promise<CreateScale> => {
    try {
        const res = await fetchWithAuth<CreateScale>(`/scale/${id}`, { method: "PUT", data: data });
        return res;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};

export const deleteScale = async (id: string) => {
    try {
        const res = await fetchWithAuth(`/scale/${id}`, { method: "DELETE" });
        return res;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};

export const confirmScale = async (id: string, confirmed: boolean) => {
    try {
        const res = await fetchWithAuth("/scale/confirm", {
            method: "POST", data: {
                scaleId: id,
                confirmed: confirmed
        } });
        return res;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};

export const searchScale = async (name: string): Promise<ListScale> => {
    try {
        const res = await fetchWithAuth<ListScale>("/scale/search", {
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