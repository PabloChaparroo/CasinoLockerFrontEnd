import type { EstadoCasilleroPercha } from "../Types/EstadoCasilleroPercha";

const BASE_URL = 'http://localhost:8080/api/estado_casillero_percha';

export const EstadoCasilleroPerchaService = {
    getEstados: async (): Promise<EstadoCasilleroPercha[]> => {
        const response = await fetch(`${BASE_URL}`);
        const data = await response.json();
        return data;
    },

    getEstado: async (idEstado: number): Promise<EstadoCasilleroPercha> => {
        const response = await fetch(`${BASE_URL}/${idEstado}`);
        const data = await response.json();
        return data;
    },

    createEstado: async (estado: Partial<EstadoCasilleroPercha>): Promise<EstadoCasilleroPercha> => {
        const response = await fetch(`${BASE_URL}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(estado)
        });
        if (!response.ok) throw new Error("Error creating estado");
        return await response.json();
    },

    updateEstado: async (idEstado: number, estado: Partial<EstadoCasilleroPercha>): Promise<EstadoCasilleroPercha> => {
        const response = await fetch(`${BASE_URL}/update/${idEstado}`, {  // <-- /update/ en la URL
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(estado)
        });
        if (!response.ok) throw new Error("Error updating estado");
        return await response.json();
    },

    deleteEstado: async (idEstado: number): Promise<void> => {
        const response = await fetch(`${BASE_URL}/${idEstado}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Error deleting estado");
    },

    darDeBaja: async (idEstado: number): Promise<EstadoCasilleroPercha> => {
        const response = await fetch(`${BASE_URL}/darDeBaja/${idEstado}`, {
            method: "PUT"
        });
        if (!response.ok) throw new Error("Error en dar de baja");
        return await response.json();
    },

    restaurar: async (idEstado: number): Promise<EstadoCasilleroPercha> => {
        const response = await fetch(`${BASE_URL}/restaurar/${idEstado}`, {
            method: "PUT"
        });
        if (!response.ok) throw new Error("Error en restaurar");
        return await response.json();
    }
};