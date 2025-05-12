import type { EstadoCasilleroPercha } from "./EstadoCasilleroPercha";
import type { TipoCasillero } from "./TipoCasillero";

export interface Casillero{

    idCasillero: number;
    numeroCasillero: number;
    fechaAltaCasillero: string | null;
    fechaBajaCasillero: string | null;
    fechaModificacionCasillero: string | null;
    tipoCasillero: TipoCasillero;
    estadoCasilleroPercha: EstadoCasilleroPercha;


}