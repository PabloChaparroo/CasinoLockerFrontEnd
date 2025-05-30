import type { Usuario } from "../Types/Usuario";
import type { UsuarioTablaDTO } from "../Types/UsuarioTablaDTO";

const BASE_URL = 'http://localhost:8080';

export const UsuarioService = {
  getUsuarios: async (): Promise<UsuarioTablaDTO[]> => {
    const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/api/usuarios/tabla`);
  if (!response.ok) throw new Error('Error al obtener usuarios');
  return await response.json();
},

  createUsuario: async (usuario: Usuario): Promise<Usuario> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/api/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(usuario)
    });
    if (!response.ok) throw new Error('Error al crear usuario');
    return await response.json();
  }
}
