import type { TipoCasillero } from "../Types/TipoCasillero";

const BASE_URL = '';

export const TipoCasilleroService = {
    getTiposCasilleros: async (): Promise<TipoCasillero[]> => {
        //const response = await fetch(`${BASE_URL}/tipocasillero`)
        const response = await fetch('/data/tiposcasilleros.json') // simula la búsqueda a la api pero lo toma del archivo json
        const data = await response.json() as TipoCasillero[];
        return data;
    },

    getTipoCasillero: async (idTipoCasillero: number): Promise<TipoCasillero> => {
        //const response = await fetch(`${BASE_URL}/tipocasillero/${idTipoCasillero}`)
        const response = await fetch('/data/tipocasillero.json')
        const data = await response.json();
        const tipoCasillero = data.find((a: TipoCasillero) => a.idTipoCasillero === idTipoCasillero);
        return tipoCasillero;
    },

    createTipoCasillero: async (tipoCasillero: TipoCasillero): Promise<TipoCasillero> => {
        const response = await fetch(`${BASE_URL}/tipocasillero`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tipoCasillero)
        });
        const data = await response.json();
        return data;
    },

    updateTipoCasillero: async (idTipoCasillero: number, tipoCasillero: TipoCasillero): Promise<TipoCasillero> => {
        const response = await fetch(`${BASE_URL}/tipocasillero/${idTipoCasillero}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tipoCasillero)
        });
        const data = await response.json();
        return data;
    },

    deleteTipoCasillero: async (idTipoCasillero: number): Promise<void> => {
        await fetch(`${BASE_URL}/tipocasillero/${idTipoCasillero}`, {
            method: "DELETE"
        });
    }
}