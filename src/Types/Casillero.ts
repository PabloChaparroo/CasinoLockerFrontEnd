import type { EstadoCasilleroPercha } from "./EstadoCasilleroPercha";
import type { TipoCasillero } from "./TipoCasillero";

export interface Casillero{

    id: number;
    numeroCasillero: number;
    fechaAltaCasillero: string | null;
    fechaBajaCasillero: string | null;
    fechaModificacionCasillero: string | null;
    tipoCasillero: TipoCasillero |  null;
    estadoCasilleroPercha: EstadoCasilleroPercha | null;
    

}