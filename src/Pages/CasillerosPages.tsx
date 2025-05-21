import React, { useState, useEffect, useMemo } from 'react';
import FilterBar from '../Components/FilterBar/FilterBar';
import { EstadoCasilleroPerchaService } from '../Services/EstadoCasilleroPerchaService';
import { CasilleroService } from '../Services/CasilleroService';
import { TipoCasilleroService } from '../Services/TipoCasilleroService'; // Asegúrate de importar el servicio de tipos de casilleros
import './CasillerosPages.css';
import type { Casillero } from '../Types/Casillero';
import type { TipoCasillero } from '../Types/TipoCasillero';
import { FaBoxOpen } from 'react-icons/fa';

interface CasilleroVisual extends Casillero {
  estadoNombre: string;
  colorEstado: string;
}

const CasillerosPages = () => {
  const [activeFilter, setActiveFilter] = useState<string>("Todos");
  const [casilleros, setCasilleros] = useState<CasilleroVisual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tipoCasilleroSeleccionado, setTipoCasilleroSeleccionado] = useState<string>("Todos");
  const [tiposCasillero, setTiposCasillero] = useState<TipoCasillero[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [casillerosData, estadosData, tiposData] = await Promise.all([
          CasilleroService.getCasilleros(),
          EstadoCasilleroPerchaService.getEstados(),
          TipoCasilleroService.getTiposCasillero() // Obtener los tipos de casilleros
        ]);

        setTiposCasillero(tiposData);

        const casillerosConColor: CasilleroVisual[] = casillerosData.map(casillero => {
          const estado = casillero.estadoCasilleroPercha;
          const estadoNombre = estado?.nombreEstadoCasilleroPercha || 'Sin estado';
          const colorEstado = estado?.colorEstadoCasilleroPercha || '#CCCCCC';

          return {
            ...casillero,
            colorEstado,
            estadoNombre,
          };
        });

        setCasilleros(casillerosConColor);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("Error al cargar los casilleros. Por favor intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCasilleros = useMemo(() => {
    let filtered = casilleros;

    if (activeFilter !== "Todos") {
      filtered = filtered.filter(c => c.estadoNombre === activeFilter);
    }

    if (tipoCasilleroSeleccionado !== "Todos") {
      filtered = filtered.filter(c => c.tipoCasillero?.nombreTipoCasillero === tipoCasilleroSeleccionado);
    }

    // Ordenar los casilleros por número de menor a mayor
    filtered.sort((a, b) => a.numeroCasillero - b.numeroCasillero);

    return filtered;
  }, [activeFilter, casilleros, tipoCasilleroSeleccionado]);

  if (error) {
    return (
      <div className="casilleros-container">
        <div className="header-section">
          <h1 className="page-title">Gestión de Casilleros</h1>
          <p className="page-subtitle">Sistema de administración de espacios</p>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="casilleros-container">
      <div className="header-section">
        <h1 className="page-title">Gestión de Casilleros</h1>
        <p className="page-subtitle">Sistema de administración de espacios</p>
      </div>

      <div className="page-container">
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <div className="tipo-casillero-selector">
          <label htmlFor="tipoCasillero">Filtrar por tipo de casillero:</label>
          <select
            id="tipoCasillero"
            value={tipoCasilleroSeleccionado}
            onChange={(e) => setTipoCasilleroSeleccionado(e.target.value)}
          >
            <option value="Todos">Todos</option>
            {tiposCasillero.map(tipo => (
              <option key={tipo.id} value={tipo.nombreTipoCasillero}>
                {tipo.nombreTipoCasillero}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando inventario de casilleros...</p>
          </div>
        ) : (
          <div className="casilleros-grid-container">
            {filteredCasilleros.length > 0 ? (
              <div className="casilleros-grid">
                {filteredCasilleros.map(casillero => (
                  <div
                    key={casillero.id}
                    className="casillero-card"
                    style={{
                      backgroundColor: casillero.colorEstado,
                      color: getContrastColor(casillero.colorEstado),
                      border: `2px solid ${darkenColor(casillero.colorEstado, 20)}`
                    }}
                  >
                    <div className="casillero-number">{casillero.numeroCasillero}</div>
                    <div className="casillero-status"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <FaBoxOpen className="no-results-icon" />
                <p>No se encontraron casilleros con este filtro</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Función para oscurecer un color
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

// Función mejorada para determinar color de texto contrastante
function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export default CasillerosPages;
