import type { EstadoCasilleroPercha } from "./EstadoCasilleroPercha";

export interface Percha{
    idPercha: number;
    numeroPercha: number;
    fechaAltaPercha: string | null;
    fechaModificacionPercha: string | null;
    fechaBajaPercha: string | null;
    estadoCasilleroPercha: EstadoCasilleroPercha;

}