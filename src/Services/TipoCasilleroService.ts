import type { TipoCasillero } from "../Types/TipoCasillero";

const BASE_URL = 'http://localhost:8080';

export const TipoCasilleroService = {
    getTiposCasillero: async (): Promise<TipoCasillero[]> => {
        const response = await fetch(`${BASE_URL}/api/tipo_casilleros`);
        return response.json();
    },

    getTipoCasillero: async (id: number): Promise<TipoCasillero> => {
        const response = await fetch(`${BASE_URL}/api/tipo_casilleros/${id}`);
        return response.json();
    },

    createTipoCasillero: async (tipoCasillero: TipoCasillero): Promise<TipoCasillero> => {
        const response = await fetch(`${BASE_URL}/api/tipo_casilleros`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tipoCasillero)
        });
        return response.json();
    },

    updateTipoCasillero: async (id: number, tipoCasillero: TipoCasillero): Promise<TipoCasillero> => {
        const response = await fetch(`${BASE_URL}/api/tipo_casilleros/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tipoCasillero)
        });
        return response.json();
    },

    deleteTipoCasillero: async (id: number): Promise<void> => {
        await fetch(`${BASE_URL}/api/tipo_casilleros/${id}`, {
            method: "DELETE"
        });
    },

    bajaTipoCasillero: async (id: number): Promise<TipoCasillero> => {
        const response = await fetch(`${BASE_URL}/api/tipo_casilleros/baja/${id}`, {
            method: "PUT"
        });
        return response.json();
    },

    restaurarTipoCasillero: async (id: number): Promise<TipoCasillero> => {
        const response = await fetch(`${BASE_URL}/api/tipo_casilleros/restaurar/${id}`, {
            method: "PUT"
        });
        return response.json();
    }
};
