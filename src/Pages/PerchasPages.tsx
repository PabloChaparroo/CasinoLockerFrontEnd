import React, { useState, useEffect, useMemo } from 'react';
import FilterBar from '../Components/FilterBar/FilterBar';
import { EstadoCasilleroPerchaService } from '../Services/EstadoCasilleroPerchaService';
import { PerchaService } from '../Services/PerchaService';
import { ReservaService } from '../Services/ReservaService';
import { TbHanger } from 'react-icons/tb';
import './PerchasPages.css';

import type { Percha } from '../Types/Percha';
import type { Reserva } from '../Types/Reserva';
import { ModalType } from '../enums/ModalTypes';

import ReservaPerchaModal from '../Components/ReservaPerchaModal/ReservaPerchaModal';
import ReservaPerchaOcupadaModal from '../Components/ReservaPerchaOcupadaModal/ReservaPerchaOcupadaModal';

interface PerchaVisual extends Percha {
  estadoNombre: string;
  colorEstado: string;
}

const PerchasPages = () => {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [perchas, setPerchas] = useState<PerchaVisual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshData, setRefreshData] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(ModalType.NONE);
  const [tituloModal, setTituloModal] = useState("");
  const [reserva, setReserva] = useState<Reserva | null>(null);

  const [showOcupadaModal, setShowOcupadaModal] = useState(false);
  const [modalTypeOcupada, setModalTypeOcupada] = useState(ModalType.NONE);
  const [tituloOcupadaModal, setTituloOcupadaModal] = useState("");
  const [perchaReserva, setPerchaReserva] = useState<Percha | null>(null);

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
          return {
            ...percha,
            estadoNombre: estado?.nombreEstadoCasilleroPercha || 'Sin estado',
            colorEstado: estado?.colorEstadoCasilleroPercha || '#CCCCCC'
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
  }, [refreshData]);

  const filteredPerchas = useMemo(() => {
    let filtered = perchas;
    if (activeFilter !== "Todos") {
      filtered = filtered.filter(p => p.estadoNombre === activeFilter);
    }
    return filtered.sort((a, b) => a.numeroPercha - b.numeroPercha);
  }, [activeFilter, perchas]);

  const initialNewReserva = (percha: Percha | null = null): Reserva => ({
  id: 0,
  numeroReserva: 0,
  fechaAltaReserva: null,
  fechaModificacionReserva: null,
  fechaBajaReserva: null,
  fechaFinalizacionReserva: null,
  estadoReserva: null,
  objetos: [{
    id: 0,
    numeroObjeto: 0,
    descripcionObjeto: "",
    fechaAltaObjeto: null,
    fechaModificacionObjeto: null,
    fechaBajaObjeto: null
  }],
  casillero: null,
  usuario: null,
  cliente: null,
  percha: percha ? { 
    id: percha.id,
    numeroPercha: percha.numeroPercha
  } : null
});

  const handleClick = (percha: PerchaVisual) => {
    if (percha.estadoCasilleroPercha?.reservable) {
      setShowModal(true);
      setModalType(ModalType.CREATE);
      setTituloModal("Reservar Percha");
      setReserva(initialNewReserva(percha));
    } else if (percha.estadoNombre === "Ocupado") {
      setShowOcupadaModal(true);
      setModalTypeOcupada(ModalType.UPDATE);
      setTituloOcupadaModal("Finalizar Reserva");
      setPerchaReserva(percha);
    }
  };

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
      </div>

      <div className="page-container">
        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

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
                    onClick={() => handleClick(percha)}
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

      {showModal && (
        <ReservaPerchaModal
          tituloModal={tituloModal}
          showModal={showModal}
          onHide={() => setShowModal(false)}
          modalType={modalType}
          reserva={reserva ?? initialNewReserva()}
          refreshData={setRefreshData}
        />
      )}

      {showOcupadaModal && (
        <ReservaPerchaOcupadaModal
          tituloModal={tituloOcupadaModal}
          showModal={showOcupadaModal}
          onHide={() => setShowOcupadaModal(false)}
          modalType={modalTypeOcupada}
          percha={perchaReserva}
          refreshData={setRefreshData}
        />
      )}
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