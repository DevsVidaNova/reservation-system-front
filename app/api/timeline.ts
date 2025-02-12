import { fetchApi, fetchWithAuth,  } from "@/hooks/api";
import { Booking, CreateBooking } from "./types";

const data = {
    "id": "1",
    "title": "CULTO DE DOMINGO",
    "description": "COM A PRESENÇA DO PASTOR FULANO",
    "date": "24/12/2025",
    "startTime": "19:00",
    "endTime": "21:00",
    "room": "TEMPLO",
    "status": "unstarted",
    "sections": [
      {
        "title": "ANTES DO CULTO",
        "description": "ENSAIO DA BANDA",
        "startTime": "18:00",
        "endTime": "19:00",
        "presentation": "https://drive.google.com/drive/folders/12345",
        "playlist": [
          {
            "title": "NADA MAIS - FHOP (ENSAIO)",
            "description": "FULANO DE TAL, FULANO DE TAL E CICLANO",
            "url": "https://www.youtube.com/watch?v=N5AMmLZjaaM"
          },
          {
            "title": "OS QUE OLHAM PARA TI - FHOP (ENSAIO)",
            "description": "FULANO DE TAL, FULANO DE TAL E CICLANO",
            "url": "https://www.youtube.com/watch?v=Dv-7mBQNEIo"
          }
        ]
      },
      {
        "title": "PRELÚDIO",
        "description": "LOUVOR COM A BANDA",
        "startTime": "19:00",
        "endTime": "19:20",
        "presentation": "https://drive.google.com/drive/folders/67890",
        "playlist": [
          {
            "title": "NADA MAIS - FHOP",
            "description": "FULANO DE TAL, FULANO DE TAL E CICLANO",
            "url": "https://www.youtube.com/watch?v=N5AMmLZjaaM"
          },
          {
            "title": "OS QUE OLHAM PARA TI - FHOP",
            "description": "FULANO DE TAL, FULANO DE TAL E CICLANO",
            "url": "https://www.youtube.com/watch?v=Dv-7mBQNEIo"
          }
        ]
      },
      {
        "title": "CULTO",
        "description": "PREGAÇÃO DO PASTOR FULANO",
        "startTime": "19:20",
        "endTime": "20:45",
        "presentation": "https://drive.google.com/drive/folders/54321"
      },
      {
        "title": "PÓSLÚDIO",
        "description": "AVISOS E DESPEDIDA",
        "startTime": "20:45",
        "endTime": "21:00",
        "presentation": "https://drive.google.com/drive/folders/98765",
        "playlist": [
          {
            "title": "NADA MAIS - FHOP (AO VIVO)",
            "description": "FULANO DE TAL, FULANO DE TAL E CICLANO",
            "url": "https://www.youtube.com/watch?v=N5AMmLZjaaM"
          },
          {
            "title": "OS QUE OLHAM PARA TI - FHOP",
            "description": "FULANO DE TAL, FULANO DE TAL E CICLANO",
            "url": "https://www.youtube.com/watch?v=Dv-7mBQNEIo"
          }
        ]
      }
    ]
  }
  