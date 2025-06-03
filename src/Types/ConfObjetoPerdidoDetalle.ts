export interface ObjetoDTO {
  numeroObjeto: number;
  descripcionObjeto: string;
}

export interface ReservaDetalleDTO {
  idReserva: number;
  clienteNombre: string;
  ubicacion: string;
  fechaHoraReserva: string;
  objetos: ObjetoDTO[];
}

export interface ConfObjetoPerdidoDetalle {
  reservas: ReservaDetalleDTO[];
}