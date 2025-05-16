import type { EstadoCasilleroPercha } from './EstadoCasilleroPercha';

export interface Percha {
    id: number;
    numeroPercha: number;
    fechaAltaPercha: string | null;
    fechaModificacionPercha: string | null;
    fechaBajaPercha: string | null;
    estadoCasilleroPercha: EstadoCasilleroPercha | null;
}
