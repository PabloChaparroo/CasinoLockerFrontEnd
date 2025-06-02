import type { Casillero } from "./Casillero";
import type { Reserva } from "./Reserva";
export interface ConfObjetoPerdido {
    id: number;
    fechaAltaConfObjetoPerdido: string;
    casillero: Casillero;
    reservas: Reserva[];
}
export interface CrearConfObjetoPerdidoDTO {
    idReserva: number;
    idCasillero: number;
}