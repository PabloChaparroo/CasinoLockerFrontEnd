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
        throw new Error('Inicio de sesión fallido');
      }

      // Recuperar el token del cuerpo de la respuesta JSON
      const { token, username , nombreUsuario, emailUsuario, dniUsuario, telefonoUsuario } = await response.json();


      if (!token) {
        throw new Error('No se encontró el token en las cabeceras de la respuesta');
      }

      // Almacena el token en localStorage y el nombre de usuario si es necesario
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('nombreUsuario', nombreUsuario);
      localStorage.setItem('emailUsuario', emailUsuario);
      localStorage.setItem('dniUsuario', dniUsuario);
      localStorage.setItem('telefonoUsuario', telefonoUsuario);

      // Puedes también almacenar otros datos relacionados con la sesión si es necesario
      // localStorage.setItem('username', loginRequest.username);

      // Devolver el token como un string
      return token;

    } catch (error) {
      console.error('Error al iniciar sesión desde el service');
      throw error; // Re-lanza el error para que pueda ser manejado por el código que llama a esta función
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
        throw new Error('Registro fallido');
      }

      // Recuperar el token del cuerpo de la respuesta JSON
      const { token } = await response.json();

      if (!token) {
        throw new Error('No se encontró el token en las cabeceras de la respuesta');
      }

      // Almacena el token en localStorage
      localStorage.setItem('token', token);

      // Puedes también almacenar otros datos relacionados con la sesión si es necesario
      // localStorage.setItem('username', loginRequest.username);

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
  }

  

};