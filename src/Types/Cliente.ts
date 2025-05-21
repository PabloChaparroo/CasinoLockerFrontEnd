
export interface Cliente{
    id: number;
    nombreCliente: string;
    dniCliente: number;
    telefonoCliente: number;
    mailCliente: string;
    fechaAltaCliente: string | null;
    fechaModificacionCliente: string | null;
    fechaBajaCliente: string | null;
}