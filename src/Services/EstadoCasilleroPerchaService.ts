import type { EstadoCasilleroPercha } from "../Types/EstadoCasilleroPercha";

const BASE_URL = '';

export const EstadoCasilleroPerchaService = {
    // Obtener todos los estados
    getEstados: async (): Promise<EstadoCasilleroPercha[]> => {
        //const response = await fetch(`${BASE_URL}/estado-casillero-percha`)
        const response = await fetch('/data/estadoCasilleroPercha.json'); // Datos json
        const data = await response.json() as EstadoCasilleroPercha[];
        return data;
    },

    // Obtener un estado específico por ID
    getEstado: async (idEstado: number): Promise<EstadoCasilleroPercha> => {
        //const response = await fetch(`${BASE_URL}/estado-casillero-percha/${idEstado}`)
        const response = await fetch('/data/estado-casillero-percha.json');
        const data = await response.json();
        const estado = data.find((e: EstadoCasilleroPercha) => e.idEstadoCasilleroPercha === idEstado);
        return estado;
    },

    // Crear un nuevo estado
    createEstado: async (estado: EstadoCasilleroPercha): Promise<EstadoCasilleroPercha> => {
        const response = await fetch(`${BASE_URL}/estado-casillero-percha`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(estado)
        });
        const data = await response.json();
        return data;
    },

    // Actualizar un estado existente
    updateEstado: async (idEstado: number, estado: EstadoCasilleroPercha): Promise<EstadoCasilleroPercha> => {
        const response = await fetch(`${BASE_URL}/estado-casillero-percha/${idEstado}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(estado)
        });
        const data = await response.json();
        return data;
    },

    // Eliminar un estado
    deleteEstado: async (idEstado: number): Promise<void> => {
        await fetch(`${BASE_URL}/estado-casillero-percha/${idEstado}`, {
            method: "DELETE"
        });
    },


};