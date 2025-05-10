import { fetchApi, fetchWithAuth, } from "@/hooks/api";
import { ListBooking, CreateBooking } from "./types";

export const listBookings = async (): Promise<ListBooking[]> => {
    try {
        const res = await fetchApi<ListBooking[]>("/booking", { method: "GET", });
        return res;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};
export const listBookingsMonth = async (): Promise<ListBooking[]> => {
    try {
        const res = await fetchApi<ListBooking[]>("/booking/month", { method: "GET", });
        return res;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};
export const listBookingsWeek = async (): Promise<ListBooking[]> => {
    try {
        const res = await fetchApi<ListBooking[]>("/booking/week", { method: "GET", });
        return res;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};
export const listBookingsToday = async (): Promise<ListBooking[]> => {
    try {
        const res = await fetchApi<ListBooking[]>("/booking/today", { method: "GET", });
        return res;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};
export const singleBooking = async (id: string): Promise<ListBooking> => {
    try {
        const res = await fetchWithAuth<ListBooking>(`/booking/${id}`, { method: "GET", });
        return res;
    } catch (error) {
        console.error("Erro ao editar reserva:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao editar reserva");
        }
    }
};
export async function addBooking(payload: any) {
    try {
      const response = await fetch("/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return { error: data?.error || "Erro ao salvar reserva" };
      }
  
      return data;
    } catch (err) {
      console.error("Erro na API addBooking:", err);
      return { error: "Erro de conexão com o servidor." };
    }
  }
  
export const editBooking = async (id: string, data: CreateBooking): Promise<CreateBooking> => {
    try {
        const res = await fetchWithAuth<CreateBooking>(`/booking/${id}`, {
            method: "PUT", data: data,
        });
        return res
    } catch (error) {
        console.error("Erro ao editar reserva:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao editar reserva");
        }
    }
};
export const listBookingsMy = async (): Promise<ListBooking[]> => {
    try {
        const res = await fetchWithAuth<ListBooking[]>("/booking/my", { method: "GET", });
        return res;
    } catch (error) {
        console.error("Erro ao editar reserva:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao editar reserva");
        }
    }
};
export const deleteBooking = async (id: string) => {
    try {
        const res = await fetchWithAuth(`/booking/${id}`, { method: "DELETE" });
        return res;
    } catch (error) {
        console.error("Erro ao editar reserva:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao editar reserva");
        }
    }
};
export const searchBooking = async (userId?: string, date?: string, room?: string, repeat?: string, dayRepeat?: string): Promise<ListBooking[]> => {
    try {
        const res = await fetchWithAuth<ListBooking[]>(`/booking/filter`, {
            method: "POST",
            data: {
                userId,
                date,
                room,
                repeat,
                dayRepeat
            }
        });
        return res
    } catch (error) {
        console.error("Erro ao editar reserva:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao editar reserva");
        }
    }
};
export const listBookingsCalendar = async (): Promise<ListBooking[]> => {
    try {
        const res = await fetchApi<ListBooking[]>("/booking/calendar", { method: "GET", });
        return res;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Erro desconhecido ao listar reservas");
        }
    }
};