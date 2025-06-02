import type { ConfObjetoPerdido, CrearConfObjetoPerdidoDTO } from "../Types/confObjetoPerdido";


const BASE_URL = 'http://localhost:8080';

export const ConfObjetoPerdidoService = {
    crearConfObjetoPerdido: async (dto: CrearConfObjetoPerdidoDTO): Promise<ConfObjetoPerdido> => {
        const response = await fetch(`${BASE_URL}/api/conf_objeto_perdido/crear`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto)
        });
        if (!response.ok) throw new Error("Error al crear configuración de objetos perdidos");
        return await response.json();
    },

};