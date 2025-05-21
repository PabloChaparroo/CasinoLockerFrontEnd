import type { TipoCasillero } from "../Types/TipoCasillero";

const BASE_URL = 'http://localhost:8080';

export const TipoCasilleroService = {
    // Obtener todos los tipos de casillero
    getTiposCasillero: async (): Promise<TipoCasillero[]> => {
        const response = await fetch(`${BASE_URL}/api/tipo_casilleros`);
        const data = await response.json() as TipoCasillero[];
        return data;
    },

    // Obtener un tipo específico por ID
    getTipoCasillero: async (idTipoCasillero: number): Promise<TipoCasillero> => {
        const response = await fetch(`${BASE_URL}/api/tipo_casilleros/${idTipoCasillero}`);
        const data = await response.json();
        const tipo = data.find((t: TipoCasillero) => t.id === idTipoCasillero);
        return tipo;
    },

    // Crear un nuevo tipo de casillero
    createTipoCasillero: async (tipoCasillero: TipoCasillero): Promise<TipoCasillero> => {
        try {
            const response = await fetch(`${BASE_URL}/api/tipo_casilleros`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tipoCasillero)
            });

            const responseText = await response.text();
            console.log('Respuesta del servidor:', responseText);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = JSON.parse(responseText);
            return data;
        } catch (error) {
            console.error('Error creating tipo casillero:', error);
            throw error;
        }
    },

    // Actualizar un tipo existente
    updateTipoCasillero: async (idTipoCasillero: number, tipoCasillero: TipoCasillero): Promise<TipoCasillero> => {
        const response = await fetch(`${BASE_URL}/api/tipo_casilleros/${idTipoCasillero}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tipoCasillero)
        });
        const data = await response.json();
        return data;
    },

    // Eliminar un tipo
    deleteTipoCasillero: async (idTipoCasillero: number): Promise<void> => {
        await fetch(`${BASE_URL}/api/tipo_casilleros/${idTipoCasillero}`, {
            method: "DELETE"
        });
    }
};