import type { EstadoCasilleroPercha } from "../Types/EstadoCasilleroPercha";

const BASE_URL = 'http://localhost:8080';

export const EstadoCasilleroPerchaService = {
    // Obtener todos los estados
    getEstados: async (): Promise<EstadoCasilleroPercha[]> => {
        const response = await fetch(`${BASE_URL}/api/estado_casillero_percha`)
        //const response = await fetch('/data/estadoCasilleroPercha.json'); // Datos json
        const data = await response.json() as EstadoCasilleroPercha[];
        return data;
    },

    // Obtener un estado específico por ID
    getEstado: async (idEstado: number): Promise<EstadoCasilleroPercha> => {
        const response = await fetch(`${BASE_URL}/api/estado_casillero_percha/${idEstado}`)
        //const response = await fetch('/data/estado-casillero-percha.json');
        const data = await response.json();
        const estado = data.find((e: EstadoCasilleroPercha) => e.id === idEstado);
        return estado;
    },

    // Crear un nuevo estado
    createEstado: async (estado: EstadoCasilleroPercha): Promise<EstadoCasilleroPercha> => {
    try {
        const response = await fetch(`${BASE_URL}/api/estado_casillero_percha`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(estado)
        });

        const responseText = await response.text(); // Obtener la respuesta como texto
        console.log('Respuesta del servidor:', responseText);
        

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = JSON.parse(responseText); // Analizar la respuesta como JSON
        return data;
    } catch (error) {
        console.error('Error creating estado:', error);
        throw error;
    }
},



    // Actualizar un estado existente
    updateEstado: async (idEstado: number, estado: EstadoCasilleroPercha): Promise<EstadoCasilleroPercha> => {
        const response = await fetch(`${BASE_URL}/api/estado_casillero_percha/${idEstado}`, {
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
        await fetch(`${BASE_URL}/api/estado_casillero_percha/${idEstado}`, {
            method: "DELETE"
        });
    },


};