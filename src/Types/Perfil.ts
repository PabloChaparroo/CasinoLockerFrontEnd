import type { Usuario } from "./Usuario";

export interface Perfil{


    id: number;
    username: string;
    fechaAltaPerfil: string | null;
    fechaBajaPerfil: string | null;
    fechaModificacionPerfil: string | null;
    estadoPerfil: string | null;
    role: string | null;
    usuario: Usuario;

}