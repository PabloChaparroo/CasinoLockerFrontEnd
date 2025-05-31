export interface ReservaPendiente {
  id: number;
  numeroReserva: number;
  fechaAltaReserva: string; // "30/05/2025 - 22:55"
  cantidadObjetos: number;
  ubicacion: string; // Ejemplo: "12 - Casillero" o "8 - Percha"
  cliente: string; // nombre del cliente
}