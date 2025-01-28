import { fetchWithAuth,  } from "@/hooks/api";
import { Stats } from "./types";

export const listDash = async () => {
    try {
       // const res: Stats = await fetchWithAuth("/dashboard", { method: "GET", });
        return {
            rooms: 22,
            bookings: 34,
            users: 12,
            week: 4,
        };
    } catch (error: any) {
        throw new Error(error.message);
    }
};
