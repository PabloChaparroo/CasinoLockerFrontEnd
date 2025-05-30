import type { Role } from "../enums/Role";

export interface UsuarioTablaDTO {
  id: number;
  nombreUsuario: string;
  dniUsuario: number;
  telefonoUsuario: number;
  emailUsuario: string;
  descripcionUsuario: string;
  fechaAltaUsuario: string | null;
  fechaBajaUsuario: string | null;
  fechaModificacionUsuario: string | null;
  estadoUsuario: string | null;
  role: string | null;
}