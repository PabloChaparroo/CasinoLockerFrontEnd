import type { Cliente } from "../Types/Cliente";


const BASE_URL='http://localhost:8080/api/clientes';

export const ClienteService = {
  getClientes: async (): Promise<Cliente[]> => {
    const response = await fetch(`${BASE_URL}`);
    if (!response.ok) throw new Error("Error al obtener clientes");
    const data = (await response.json()) as Cliente[];
    return data;
  },

  getCliente: async (idCliente: number): Promise<Cliente> => {
    const response = await fetch(`${BASE_URL}/${idCliente}`);
    if (!response.ok) throw new Error("Cliente no encontrado");
    const data = (await response.json()) as Cliente;
    return data;
  },

  createCliente: async (cliente: Cliente): Promise<Cliente> => {
    const response = await fetch(`${BASE_URL}/crear`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    });
    if (!response.ok) throw new Error("Error al crear cliente");
    const data = (await response.json()) as Cliente;
    return data;
  },

  updateCliente: async (idCliente: number, cliente: Cliente): Promise<Cliente> => {
    const response = await fetch(`${BASE_URL}/modificar/${idCliente}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    });
    if (!response.ok) throw new Error("Error al actualizar cliente");
    const data = (await response.json()) as Cliente;
    return data;
  },

  deleteCliente: async (idCliente: number): Promise<void> => {
    await fetch(`${BASE_URL}/darDeBaja/${idCliente}`, {
      method: "PUT",
    });
  },

  restaurarCliente: async (idCliente: number): Promise<Cliente> => {
    const response = await fetch(`${BASE_URL}/restaurar/${idCliente}`, {
      method: "PUT",
    });
    if (!response.ok) throw new Error("Error al restaurar cliente");
    const data = (await response.json()) as Cliente;
    return data;
  },

  buscarClientesPorNombre: async (nombre: string): Promise<Cliente[]> => {
    const response = await fetch(`${BASE_URL}/buscar/${encodeURIComponent(nombre)}`);
    if (!response.ok) throw new Error("Error al buscar clientes");
    const data = (await response.json()) as Cliente[];
    return data;
  },
};