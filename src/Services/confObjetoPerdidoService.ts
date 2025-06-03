import type { ConfObjetoPerdido, CrearConfObjetoPerdidoDTO } from "../Types/confObjetoPerdido";
import type { ConfObjetoPerdidoDetalle } from "../Types/ConfObjetoPerdidoDetalle";

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
    obtenerDetallePorIdCasillero: async (idCasillero: number): Promise<ConfObjetoPerdidoDetalle> => {
    const response = await fetch(`${BASE_URL}/api/conf_objeto_perdido/detalle/casillero/${idCasillero}`);
    if (!response.ok) throw new Error("Error al obtener detalle");
    return await response.json();
  },
  despacharReserva: async (idReserva: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/conf_objeto_perdido/despachar?idReserva=${idReserva}`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Error al despachar la reserva");
    },

};