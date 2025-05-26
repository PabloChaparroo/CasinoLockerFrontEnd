import type { Percha } from '../Types/Percha';
const BASE_URL = 'http://localhost:8080';

export const PerchaService = {
    getPerchas: async (showDeleted: boolean = false): Promise<Percha[]> => {
        const response = await fetch(`${BASE_URL}/api/perchas?showDeleted=${showDeleted}`);
        return await response.json();
    },

    getPercha: async (id: number): Promise<Percha> => {
        const response = await fetch(`${BASE_URL}/api/perchas/${id}`);
        return await response.json();
    },

    createPercha: async (percha: Percha): Promise<Percha> => {
        const response = await fetch(`${BASE_URL}/api/perchas`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                numeroPercha: percha.numeroPercha,
                estadoCasilleroPercha: percha.estadoCasilleroPercha,
            }),
        });
        return await response.json();
    },

    updatePercha: async (id: number, percha: Percha): Promise<Percha> => {
        const response = await fetch(`${BASE_URL}/api/perchas/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                numeroPercha: percha.numeroPercha,
                estadoCasilleroPercha: percha.estadoCasilleroPercha,
            }),
        });
        return await response.json();
    },

    deletePercha: async (id: number): Promise<void> => {
        await fetch(`${BASE_URL}/api/perchas/${id}`, { method: "DELETE" });
    },

    darDeBaja: async (id: number): Promise<Percha> => {
        const response = await fetch(`${BASE_URL}/api/perchas/${id}/baja`, {
            method: "PUT",
        });
        return await response.json();
    },

    darDeAlta: async (id: number): Promise<Percha> => {
        const response = await fetch(`${BASE_URL}/api/perchas/${id}/alta`, {
            method: "PUT",
        });
        return await response.json();
    },
};