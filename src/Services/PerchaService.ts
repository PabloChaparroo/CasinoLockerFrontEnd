import type { Percha } from '../Types/Percha';
const BASE_URL = 'http://localhost:8080';

export const PerchaService = {
    getPerchas: async (): Promise<Percha[]> => {
        const response = await fetch(`${BASE_URL}/api/perchas`);
        const data = await response.json();
        return data;
    },

    getPercha: async (id: number): Promise<Percha> => {
        const response = await fetch(`${BASE_URL}/api/perchas/${id}`);
        const data = await response.json();
        return data;
    },

    createPercha: async (percha: Percha): Promise<Percha> => {
        const response = await fetch(`${BASE_URL}/api/perchas`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(percha)
        });
        const data = await response.json();
        return data;
    },

    updatePercha: async (id: number, percha: Percha): Promise<Percha> => {
        const response = await fetch(`${BASE_URL}/api/perchas/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(percha)
        });
        const data = await response.json();
        return data;
    },

    deletePercha: async (id: number): Promise<void> => {
        await fetch(`${BASE_URL}/api/perchas/${id}`, {
            method: "DELETE"
        });
    },
};