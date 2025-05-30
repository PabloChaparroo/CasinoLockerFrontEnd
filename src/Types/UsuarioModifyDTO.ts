export interface UsuarioModifyDTO {
  idUsuario: number;
  idRole: number;
  nombreUsuario: string;
  apellidoUsuario: string;
  telefonoUsuario: number;
  dniUsuario: number;
  descripcionUsuario: string;
  emailUsuario: string;
  fechaHoraModificacionUsuario: string | null;
}