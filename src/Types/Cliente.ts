
export interface Cliente{
    id: number;
    nombreCliente: string;
    dniCliente: number;
    telefonoCliente: number;
    mailCliente: string;
    fechaHoraAltaCliente: string | null;
    fechaHoraModificacionCliente: string | null;
    fechaHoraBajaCliente: string | null;
}