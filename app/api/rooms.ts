import { fetchApi, fetchWithAuth,  } from "@/hooks/api";
import { Room, RoomAdd } from "./types";


export const listRooms = async (page: number) => {
    try {
        //const res: Room[] = await fetchApi("/rooms", { method: "GET" });
        //return res;
        return roomlist;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const showRoom = async (id: string) => {
    try {
        const res: Room = await fetchApi("/rooms/"+id, { method: "GET",});
        return res;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const addRoom = async (data: RoomAdd) => {
    try {
        const res: any = await fetchWithAuth("/rooms", { method: "POST", data: data });
        return res;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const editRoom = async (data: Room) => {
    try {
        const res: any = await fetchWithAuth("/rooms/", { method: "PUT", data: data });
        return res;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const deleteRoom = async (id: string) => {
    try {
        const res: any = await fetchWithAuth("/rooms/"+id, { method: "DELETE" });
        return res;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const roomlist = 
[
    {
      "id": "1",
      "name": "Espaço salão de cultos",
      "size": 100,
      "description": "Sala principal para cultos e eventos",
      "exclusive": false,
      "status": true
    },
    {
      "id": "2",
      "name": "Espaço multiuso",
      "size": 70,
      "description": "EBD 9h / Celebração kids 10h15",
      "exclusive": false,
      "status": true
    },
    {
      "id": "3",
      "name": "Espaço Vida: sala 1 (Studio)",
      "size": 10,
      "description": "Domingo 9 às 10h15 Ensaio banda kids",
      "exclusive": false,
      "status": true
    },
    {
      "id": "4",
      "name": "Espaço Vida: sala 2 (Vidro)",
      "size": 15,
      "description": "Pré-adolescentes 10h30",
      "exclusive": false,
      "status": true
    },
    {
      "id": "5",
      "name": "Espaço Vida: sala 3",
      "size": 30,
      "description": "Pré-primário (Ex tunala+juniores)",
      "exclusive": false,
      "status": true
    },
    {
      "id": "6",
      "name": "Espaço Nova: sala 7 (Gabinete)",
      "size": 20,
      "description": "Sala de gabinete",
      "exclusive": true,
      "status": true
    },
    {
      "id": "7",
      "name": "Espaço Nova: sala 8 (Reunião)",
      "size": 10,
      "description": "Sala para reuniões",
      "exclusive": false,
      "status": true
    },
    {
      "id": "8",
      "name": "Espaço casarão: Sala 10",
      "size": 15,
      "description": "Sala dos professores",
      "exclusive": true,
      "status": true
    },
    {
      "id": "9",
      "name": "Espaço casarão: Sala 13",
      "size": 20,
      "description": "Sala de dança",
      "exclusive": true,
      "status": true
    },
    {
      "id": "10",
      "name": "Espaço casarão: Sala 17",
      "size": 10,
      "description": "Depósito",
      "exclusive": true,
      "status": true
    }
  ]
  