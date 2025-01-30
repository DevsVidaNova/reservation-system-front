import { fetchWithAuth,  } from "@/hooks/api";
import { Stats } from "./types";

export const listDash = async () => {
    try {
        const res: Stats = await fetchWithAuth("/stats", { method: "GET", });
        console.log(res);
        return res;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
