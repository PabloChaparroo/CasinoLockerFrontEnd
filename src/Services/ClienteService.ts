import type { Cliente } from "../Types/Cliente";


const BASE_URL='http://localhost:8080';

export const ClienteService ={
    getClientes: async():Promise<Cliente[]>=>{
        const response= await fetch (`${BASE_URL}/api/clientes`)
        //const response= await fetch ('/data/clientes.json') //simula la búsqueda a la api pero lo toma del archivo json
        const data= await response.json() as Cliente[];
        return data;
    },

    getCliente: async(idCliente:number):Promise<Cliente[]>=>{
        const response= await fetch (`${BASE_URL}/api/clientes/${idCliente}`)
        //const response= await fetch ('/data/cliente.json')
        const data= await response.json();
        const clientes = data.find((a:Cliente) => a.id === idCliente);    //esto solo se utiliza al recuperar los datos del archivo json, cuando se consulta a la api devuelve directamente data
        return clientes;
    },
    createCliente: async (cliente: Cliente): Promise<Cliente> =>{ 
        const response = await fetch(`${BASE_URL}/api/clientes`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });
        const data = await response.json();
        return data;
    },

    updateCliente: async (idCliente: number, cliente: Cliente): Promise<Cliente> => {
        const response = await fetch(`${BASE_URL}/api/clientes/${idCliente}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });
        const data = await response.json();
        return data;
    },

    deleteCliente: async (idCliente: number): Promise<void> => {
        await fetch(`${BASE_URL}/api/clientes/${idCliente}`, {
            method: "DELETE"
        });
    }
}