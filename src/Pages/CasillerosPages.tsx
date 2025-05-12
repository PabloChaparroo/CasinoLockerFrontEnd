// CasillerosPages.tsx
import React, { useState, useEffect } from 'react';
import FilterBar from '../Components/FilterBar/FilterBar';
import { EstadoCasilleroPerchaService } from '../Services/EstadoCasilleroPerchaService';
import { CasilleroService } from '../Services/CasilleroService';
import './CasillerosPages.css';
import type { Casillero } from '../Types/Casillero';

interface CasilleroVisual extends Casillero {
  colorEstado: string;
}

const CasillerosPages = () => {
  const [activeFilter, setActiveFilter] = useState<string>("Todos");
  const [casilleros, setCasilleros] = useState<CasilleroVisual[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos en paralelo
        const [casillerosData, estadosData] = await Promise.all([
          CasilleroService.getCasilleros(),
          EstadoCasilleroPerchaService.getEstados()
        ]);
        
        // Mapear casilleros con color
        const casillerosConColor: CasilleroVisual[] = casillerosData.map(casillero => ({
          ...casillero,
          colorEstado: casillero.estadoCasilleroPercha.colorEstadoCasilleroPercha || '#CCCCCC'
        }));
        
        setCasilleros(casillerosConColor);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filtrar casilleros según el estado seleccionado
  const filteredCasilleros = activeFilter === "Todos" 
    ? casilleros 
    : casilleros.filter(c => c.estadoCasilleroPercha.nombreEstadoCasilleroPercha === activeFilter);

  return (
    <div className="casilleros-container">
      <h1>Casilleros</h1>
      <div className="page-container">
        <FilterBar 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        
        {loading ? (
          <div className="loading">Cargando casilleros...</div>
        ) : (
          <div className="casilleros-grid">
            {filteredCasilleros.map(casillero => (
              <div 
                key={casillero.idCasillero}
                className="casillero-card"
                style={{ 
                  backgroundColor: casillero.colorEstado,
                  color: getContrastColor(casillero.colorEstado) // Función para texto legible
                }}
              >
                <div className="casillero-number">{casillero.numeroCasillero}</div>
                <div className="casillero-status">
                  {casillero.estadoCasilleroPercha.nombreEstadoCasilleroPercha}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Función auxiliar para determinar color de texto contrastante
function getContrastColor(hexColor: string): string {
  // Implementación básica - puedes mejorarla
  return '#ffffff'; // Siempre blanco para simplificar
  // O implementar lógica real para determinar si usar blanco o negro
}

export default CasillerosPages;