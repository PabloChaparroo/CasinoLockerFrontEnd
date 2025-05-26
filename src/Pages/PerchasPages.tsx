import React, { useState, useEffect, useMemo } from 'react';
import FilterBar from '../Components/FilterBar/FilterBar';
import { EstadoCasilleroPerchaService } from '../Services/EstadoCasilleroPerchaService';
import { PerchaService } from '../Services/PerchaService';
import './PerchasPages.css';
import type { Percha } from '../Types/Percha';
import { TbHanger } from 'react-icons/tb';

interface PerchaVisual extends Percha {
  estadoNombre: string;
  colorEstado: string;
}

const PerchasPages = () => {
  const [activeFilter, setActiveFilter] = useState<string>("Todos");
  const [perchas, setPerchas] = useState<PerchaVisual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [perchasData, estadosData] = await Promise.all([
          PerchaService.getPerchas(),
          EstadoCasilleroPerchaService.getEstados()
        ]);

        const perchasConColor: PerchaVisual[] = perchasData.map(percha => {
          const estado = percha.estadoCasilleroPercha;
          const estadoNombre = estado?.nombreEstadoCasilleroPercha || 'Sin estado';
          const colorEstado = estado?.colorEstadoCasilleroPercha || '#CCCCCC';

          return {
            ...percha,
            estadoNombre,
            colorEstado,
          };
        });

        setPerchas(perchasConColor);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("Error al cargar las perchas. Por favor intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPerchas = useMemo(() => {
    let filtered = perchas;
    if (activeFilter !== "Todos") {
      filtered = filtered.filter(p => p.estadoNombre === activeFilter);
    }
    filtered.sort((a, b) => a.numeroPercha - b.numeroPercha);
    return filtered;
  }, [activeFilter, perchas]);

  if (error) {
    return (
      <div className="perchas-container">
        <div className="header-section">
          <h1 className="page-title">Gestión de Perchas</h1>
          <p className="page-subtitle">Sistema de administración de espacios</p>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="perchas-container">
      <div className="header-section">
        <h1 className="page-title">Gestión de Perchas</h1>
        <p className="page-subtitle">Sistema de administración de espacios</p>
      </div>

      <div className="page-container">
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando inventario de perchas...</p>
          </div>
        ) : (
          <div className="perchas-grid-container">
            {filteredPerchas.length > 0 ? (
              <div className="perchas-grid">
                {filteredPerchas.map(percha => (
                  <div
                    key={percha.id}
                    className="percha-card"
                    style={{
                      backgroundColor: percha.colorEstado,
                      color: getContrastColor(percha.colorEstado),
                      border: `2px solid ${darkenColor(percha.colorEstado, 20)}`
                    }}
                  >
                    <div className="percha-icon-container">
                      <TbHanger className="percha-icon" />
                    </div>
                    <div className="percha-number">{percha.numeroPercha}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <TbHanger className="no-results-icon" />
                <p>No se encontraron perchas con este filtro</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;

  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1)}`;
}

function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export default PerchasPages;