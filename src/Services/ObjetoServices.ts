import type { Objeto } from "../Types/Objeto";

const BASE_URL = 'http://localhost:8080';

export const ObjetoService = {
    getObjetos: async (): Promise<Objeto[]> => {
        const response = await fetch(`${BASE_URL}/api/objetos`);
        const data = await response.json() as Objeto[];
        return data;
    },

    getObjeto: async (idObjeto: number): Promise<Objeto> => {
        const response = await fetch(`${BASE_URL}/api/objetos/${idObjeto}`);
        const data = await response.json();
        return data;
    },

    createObjeto: async (objeto: Partial<Objeto>): Promise<Objeto> => {
        const response = await fetch(`${BASE_URL}/api/objetos`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objeto)
        });
        const data = await response.json();
        return data;
    },

    updateObjeto: async (idObjeto: number, objeto: Partial<Objeto>): Promise<Objeto> => {
        const response = await fetch(`${BASE_URL}/api/objetos/${idObjeto}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objeto)
        });
        const data = await response.json();
        return data;
    },

    deleteObjeto: async (idObjeto: number): Promise<void> => {
        await fetch(`${BASE_URL}/api/objetos/${idObjeto}`, {
            method: "DELETE"
        });
    }
};