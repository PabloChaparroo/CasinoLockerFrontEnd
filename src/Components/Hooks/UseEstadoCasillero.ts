
import { useState, useEffect } from 'react';
import { EstadoCasilleroPerchaService } from '../../Services/EstadoCasilleroPerchaService';


export const useEstadosCasillero = () => {
  const [estados, setEstados] = useState<string[]>(['Todos']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const data = await EstadoCasilleroPerchaService.getEstados();
        const nombresEstados = data.map(e => e.nombreEstadoCasilleroPercha);
        setEstados(['Todos', ...nombresEstados]);
      } catch (err) {
        setError('Error al cargar los estados');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEstados();
  }, []);

  return { estados, loading, error };
};