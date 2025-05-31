
import type { Casillero } from "./Casillero";
import type { Usuario } from "./Usuario";
import type { Cliente } from "./Cliente";
import type { Objeto } from "./Objeto";
import type { EstadoReserva } from "../enums/estadoReserva";

export interface Reserva {
  id: number;
  numeroReserva: number;
  fechaAltaReserva: string | null;
  fechaModificacionReserva: string | null;
  fechaBajaReserva: string | null;
  fechaFinalizacionReserva: string | null ,
  estadoReserva: EstadoReserva | null;
  objetos: Objeto[] | null;
  casillero: Casillero | null;
  usuario: Usuario | null;
  cliente: Cliente | null;
}