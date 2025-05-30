import type { LoginRequest } from "../Types/LoginRequest";
import type { RegisterRequest } from "../Types/RegisterRequest";




const BASE_URL = 'http://localhost:8080';

export const AuthService = {
  
  login: async (loginRequest: LoginRequest): Promise<string> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginRequest),
    });

    if (!response.ok) {
      // Adjunta el status al error para que el frontend pueda mostrar el toast correcto
      const error: any = new Error('Inicio de sesión fallido');
      error.response = { status: response.status };
      throw error;
    }

    // Recuperar el token del cuerpo de la respuesta JSON
    const { token, id, username , nombreUsuario, emailUsuario, dniUsuario, telefonoUsuario } = await response.json();

    if (!token) {
      throw new Error('No se encontró el token en las cabeceras de la respuesta');
    }

    // Almacena el token en localStorage
localStorage.setItem('token', token);
localStorage.setItem('id', id);
localStorage.setItem('username', username);
localStorage.setItem('nombreUsuario', nombreUsuario);
localStorage.setItem('emailUsuario', emailUsuario);
localStorage.setItem('dniUsuario', dniUsuario);
localStorage.setItem('telefonoUsuario', telefonoUsuario);

// Guarda el usuario como objeto
const usuario = {
  id,
  username,
  nombreUsuario,
  emailUsuario,
  dniUsuario,
  telefonoUsuario,
};
localStorage.setItem('usuario', JSON.stringify(usuario));

return token;

  } catch (error) {
    console.error('Error al iniciar sesión desde el service');
    throw error;
  }
},

  register: async (registerRequest: RegisterRequest): Promise<string> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerRequest),
    });

    if (!response.ok) {
      // Adjunta el status al error para que el frontend pueda mostrar el toast correcto
      const error: any = new Error('Registro fallido');
      error.response = { status: response.status };
      throw error;
    }

    // Recuperar el token del cuerpo de la respuesta JSON
    const { token } = await response.json();

    if (!token) {
      throw new Error('No se encontró el token en las cabeceras de la respuesta');
    }

    // Almacena el token en localStorage
    localStorage.setItem('token', token);

    // Devolver el token como un string
    return token;

  } catch (error) {
    console.error('Error al registrar desde el service');
    throw error; // Re-lanza el error para que pueda ser manejado por el código que llama a esta función
  }
},

  getPerfil: async (): Promise<any> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No autenticado');
    const response = await fetch(`${BASE_URL}/api/usuarios/showProfile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('No autorizado');
    return await response.json();
  },

  logout: (): void => {
    localStorage.removeItem('token');
    // Si guardas más datos de usuario, elimínalos aquí también
  },
  updateProfile: async (usuarioActualizado: any): Promise<any> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No autenticado');
    const response = await fetch(`${BASE_URL}/api/usuarios/updateProfile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuarioActualizado)
    });
    if (!response.ok) throw new Error('No autorizado');
    return await response.json();
  },

  modifyUsuario: async (usuarioModifyDTO: any): Promise<any> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No autenticado');
    const response = await fetch(`${BASE_URL}/api/usuarios/modifyUsuario`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuarioModifyDTO)
    });
    if (!response.ok) throw new Error('No autorizado');
    return await response.json();
  },

  deleteUsuario: async (idUsuario: number): Promise<any> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No autenticado');
  const response = await fetch(`${BASE_URL}/api/usuarios/deleteUsuario`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(idUsuario)
  });
  if (!response.ok) throw new Error('No autorizado');
  return await response.json();
},

  getUsuarioByEmailUsuario: async (emailUsuario: string): Promise<any> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No autenticado');
    const response = await fetch(`${BASE_URL}/api/usuarios/getUsuarioByEmailUsuario?emailUsuario=${encodeURIComponent(emailUsuario)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('No autorizado');
    return await response.json();
  },

  restaurarUsuario: async (idUsuario: number): Promise<any> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No autenticado');
  const response = await fetch(`${BASE_URL}/api/usuarios/restaurar/${idUsuario}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(idUsuario)
  });
  if (!response.ok) throw new Error('No autorizado');
  return await response.json();
},

  

};