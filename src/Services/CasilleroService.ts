import type { Casillero } from "../Types/Casillero";


const BASE_URL='';

export const CasilleroService ={
    getCasilleros: async():Promise<Casillero[]>=>{
        //const response= await fetch (`${BASE_URL}/casillero`)
        const response= await fetch ('/data/casillero.json') //simula la búsqueda a la api pero lo toma del archivo json
        const data= await response.json() as Casillero[];
        return data;
    },

    getCasillero: async(idCasillero:number):Promise<Casillero[]>=>{
        //const response= await fetch (`${BASE_URL}/casillero/${idCasillero}`)
        const response= await fetch ('/data/casillero.json')
        const data= await response.json();
        const casillero = data.find((a:Casillero) => a.idCasillero === idCasillero);    //esto solo se utiliza al recuperar los datos del archivo json, cuando se consulta a la api devuelve directamente data
        return casillero;
    },
    createCasillero: async (casillero: Casillero): Promise<Casillero> =>{ 
        const response = await fetch(`${BASE_URL}/casillero`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(casillero)
        });
        const data = await response.json();
        return data;
    },

    updateCasillero: async (idCasillero: number, casillero: Casillero): Promise<Casillero> => {
        const response = await fetch(`${BASE_URL}/casillero/${idCasillero}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(casillero)
        });
        const data = await response.json();
        return data;
    },

    deleteCasillero: async (idCasillero: number): Promise<void> => {
        await fetch(`${BASE_URL}/casillero/${idCasillero}`, {
            method: "DELETE"
        });
    }
}