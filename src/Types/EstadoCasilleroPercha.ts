
export type EstadoCasilleroPercha = {
  id?: number;
  nombreEstadoCasilleroPercha: string;
  colorEstadoCasilleroPercha: string;
  reservable: boolean;
  fechaAltaEstadoCasilleroPercha?: string | null;
  fechaModificacionEstadoCasilleroPercha?: string | null;
  fechaBajaEstadoCasilleroPercha?: string | null;
};