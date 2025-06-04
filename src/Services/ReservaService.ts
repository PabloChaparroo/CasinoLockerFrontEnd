import type { Reserva } from "../Types/Reserva";
import type { ReservaPendiente } from "../Types/ReservaPendiente";
import type { ReservaReporte } from "../Types/ReservaReporte";
import type { ReservaClienteReporte } from "../Types/ReservaClienteReporte";

const BASE_URL = 'http://localhost:8080';

export const ReservaService = {

    getReservas: async (): Promise<Reserva[]> => {
        const response = await fetch(`${BASE_URL}/api/reservas`);
        const data = await response.json() as Reserva[];
        return data;
    },

    getReserva: async (idReserva: number): Promise<Reserva> => {
        const response = await fetch(`${BASE_URL}/api/reservas/${idReserva}`);
        const data = await response.json();
        return data;
    },

    createReserva: async (reserva: Partial<Reserva>): Promise<Reserva> => {
        const response = await fetch(`${BASE_URL}/api/reservas/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reserva)
        });
        const data = await response.json();
        return data;
    },

    updateReserva: async (idReserva: number, reserva: Partial<Reserva>): Promise<Reserva> => {
        const response = await fetch(`${BASE_URL}/api/reservas/${idReserva}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reserva)
        });
        const data = await response.json();
        return data;
    },

    deleteReserva: async (idReserva: number): Promise<void> => {
        await fetch(`${BASE_URL}/api/reservas/${idReserva}`, {
            method: "DELETE"
        });
    },

    getReservaCasillero: async (idCasillero: number): Promise<Reserva> => {
        const response = await fetch(`${BASE_URL}/api/reservas/reservaPorCasillero/${idCasillero}`);
        const data = await response.json() as Reserva;
        return data;
    },
    
    finalizarReserva: async (idReserva: number): Promise<void> => {
        const response = await fetch(`${BASE_URL}/api/reservas/finalizar/${idReserva}`, {
            method: "PUT", 
            headers: {
                'Content-Type': 'application/json'
            },
  
        });

        if (!response.ok) {
            throw new Error('Error al finalizar la reserva');
        }

        const data = await response.json();
        return data;
    },
     getReservasPendientes: async (): Promise<ReservaPendiente[]> => {
    const response = await fetch(`${BASE_URL}/api/reservas/activas`);
    if (!response.ok) {
      throw new Error("Error al obtener las reservas pendientes");
    }
    const data = await response.json();
    return data as ReservaPendiente[];
  },
   getReservaPorPercha: async (idPercha: number): Promise<Reserva> => {
        const response = await fetch(`${BASE_URL}/api/reservas/reservaPorPercha/${idPercha}`);
        if (!response.ok) {
            throw new Error("Error al obtener la reserva por percha");
        }
        const data = await response.json();
        return data as Reserva;
    },
    getReservasEntreFechas: async (desde: string, hasta: string): Promise<ReservaReporte[]> => {
        const response = await fetch(`${BASE_URL}/api/reservas/reporte?desde=${desde}&hasta=${hasta}`);
        if (!response.ok) {
            throw new Error("Error al obtener el reporte de reservas");
        }
        const data = await response.json();
        return data as ReservaReporte[];
        },
    getReservasPorCliente: async (
        idCliente: number,
        desde: string,
        hasta: string
        ): Promise<ReservaClienteReporte[]> => {
        const response = await fetch(`${BASE_URL}/api/reservas/reportePorCliente?idCliente=${idCliente}&desde=${desde}&hasta=${hasta}`);
        if (!response.ok) {
            throw new Error("Error al obtener el reporte por cliente");
        }
        const data = await response.json();
        return data as ReservaClienteReporte[];
        },    
};


