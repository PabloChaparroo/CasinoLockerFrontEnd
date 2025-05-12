import type { Percha } from "../Types/Percha";

const BASE_URL = '';

export const PerchaService = {
    getPerchas: async (): Promise<Percha[]> => {
        //const response = await fetch(`${BASE_URL}/percha`)
        const response = await fetch('/data/perchas.json') // Simulación con archivo JSON
        const data = await response.json() as Percha[];
        return data;
    },

    getPercha: async (idPercha: number): Promise<Percha> => {
        //const response = await fetch(`${BASE_URL}/percha/${idPercha}`)
        const response = await fetch('/data/percha.json')
        const data = await response.json();
        const percha = data.find((p: Percha) => p.idPercha === idPercha);
        return percha;
    },

    createPercha: async (percha: Percha): Promise<Percha> => {
        const response = await fetch(`${BASE_URL}/percha`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(percha)
        });
        const data = await response.json();
        return data;
    },

    updatePercha: async (idPercha: number, percha: Percha): Promise<Percha> => {
        const response = await fetch(`${BASE_URL}/percha/${idPercha}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(percha)
        });
        const data = await response.json();
        return data;
    },

    deletePercha: async (idPercha: number): Promise<void> => {
        await fetch(`${BASE_URL}/percha/${idPercha}`, {
            method: "DELETE"
        });
    }
}