export interface ReservaClienteReporte {
  nombreCliente: string;
  ubicacion: string;
  fechaHoraInicio: string;
  fechaHoraFinalizacion: string;
  estadoReserva: string;
  objetos: {
    numeroObjeto: number;
    descripcionObjeto: string;
  }[];
}