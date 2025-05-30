import React, { useState, useEffect, useMemo } from 'react';
import FilterBar from '../Components/FilterBar/FilterBar';
import { EstadoCasilleroPerchaService } from '../Services/EstadoCasilleroPerchaService';
import { CasilleroService } from '../Services/CasilleroService';
import { TipoCasilleroService } from '../Services/TipoCasilleroService';
import './CasillerosPages.css';
import type { Casillero } from '../Types/Casillero';
import type { TipoCasillero } from '../Types/TipoCasillero';
import { FaBoxOpen } from 'react-icons/fa';
import { ModalType } from '../enums/ModalTypes';
import type { Reserva } from '../Types/Reserva';
import ReservaModal from '../Components/ReservaModal/ReservaModal';
import { ReservaService } from '../Services/ReservaService';
import ReservaOcupadaModal from '../Components/ReservaOcupadaModal/ReservaOcupadaModal';

interface CasilleroVisual extends Casillero {
  estadoNombre: string;
  colorEstado: string;
}

const CasillerosPages = () => {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [casilleros, setCasilleros] = useState<CasilleroVisual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tipoCasilleroSeleccionado, setTipoCasilleroSeleccionado] = useState("Todos");
  const [tiposCasillero, setTiposCasillero] = useState<TipoCasillero[]>([]);
  
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [casillerosData, estadosData, tiposData] = await Promise.all([
          CasilleroService.getCasilleros(),
          EstadoCasilleroPerchaService.getEstados(),
          TipoCasilleroService.getTiposCasillero()
        ]);

        setTiposCasillero(tiposData);

        setCasilleros(
          casillerosData.map(casillero => ({
            ...casillero,
            estadoNombre: casillero.estadoCasilleroPercha?.nombreEstadoCasilleroPercha || 'Sin estado',
            colorEstado: casillero.estadoCasilleroPercha?.colorEstadoCasilleroPercha || '#CCCCCC',
          }))
        );
      } catch {
        setError("Error al cargar los casilleros. Por favor intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshData]);

  const filteredCasilleros = useMemo(() => {
    let filtered = casilleros;
    if (activeFilter !== "Todos") {
      filtered = filtered.filter(c => c.estadoNombre === activeFilter);
    }
    if (tipoCasilleroSeleccionado !== "Todos") {
      filtered = filtered.filter(c => c.tipoCasillero?.nombreTipoCasillero === tipoCasilleroSeleccionado);
    }
    return filtered.sort((a, b) => a.numeroCasillero - b.numeroCasillero);
  }, [activeFilter, casilleros, tipoCasilleroSeleccionado]);

  if (error) {
    return (
      <div className="casilleros-container">
        <h1 className="page-title">Gestión de Casilleros</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(ModalType.NONE);
  const [tituloModal, setTituloModal] = useState("");
  const [reserva, setReserva] = useState<Reserva | null>(null);



  //Modal Reserva 
    const initialNewReserva = (casillero: Casillero | null = null): Reserva => ({
      id: 0,
      numeroReserva: 0,
      fechaAltaReserva: null,
      fechaModificacionReserva: null,
      fechaBajaReserva: null,
      estadoReserva: null,
      objetos: [],
      casillero: casillero,
      usuario: null,
      cliente: null
    });
  
  
 const handleClick = (tituloModal: string, reserva: Reserva, modalType: ModalType) => {
     setShowModal(true);
     setModalType(modalType);
     setReserva(reserva);
     setTituloModal(tituloModal);
   };

  const [showReservaOcupadaModal, setShowReservaOcupadaModal] = useState(false);
  const [modalTypeReservaOcupadaModal, setModalTypeReservaOcupadaModal] = useState(ModalType.NONE);
  const [tituloReservaOcupadaModal, setTituloReservaOcupadaModal] = useState("");
  const [casilleroReserva, setCasilleroReserva] = useState<Casillero | null >(null);



   const handleClickReservaOcupadaModal = (tituloReservaOcupadaModal: string, casillero: Casillero, modalType: ModalType) => {
     setShowReservaOcupadaModal(true);
     setModalTypeReservaOcupadaModal(modalType);
     setCasilleroReserva(casillero);
     setTituloReservaOcupadaModal(tituloReservaOcupadaModal);
   };

  return (


    
    <div className="casilleros-container">
      <h1 className="page-title">Gestión de Casilleros</h1>
      <div className="page-container">
        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <div className="tipo-casillero-selector">
          <label htmlFor="tipoCasillero">Filtrar por tipo de casillero:</label>
          <select
            id="tipoCasillero"
            value={tipoCasilleroSeleccionado}
            onChange={e => setTipoCasilleroSeleccionado(e.target.value)}
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
                    onClick={() => {
                      if (casillero.estadoCasilleroPercha?.reservable) {
                        handleClick("Reservar Casillero", initialNewReserva(casillero), ModalType.CREATE);
                      } else if (casillero.estadoCasilleroPercha?.nombreEstadoCasilleroPercha === "Ocupado") {
                        handleClickReservaOcupadaModal("Finalizar Reserva", casillero, ModalType.UPDATE);
                      }
                    }}
                    className="casillero-card"
                    style={{
                      backgroundColor: casillero.colorEstado,
                      color: getContrastColor(casillero.colorEstado),
                      border: `2px solid ${darkenColor(casillero.colorEstado, 20)}`
                    }}
                  >
                    <div className="casillero-number">{casillero.numeroCasillero}</div>
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
      {showModal && (
        <ReservaModal
          tituloModal={tituloModal}
          showModal={showModal}
          onHide={() => setShowModal(false)}
          modalType={modalType}
          reserva={reserva ?? initialNewReserva()} 
          refreshData={setRefreshData}
        />
      )}

      {showReservaOcupadaModal && (
  <ReservaOcupadaModal
    tituloModal={tituloReservaOcupadaModal}
    showModal={showReservaOcupadaModal}
    onHide={() => setShowReservaOcupadaModal(false)}
    modalType={modalTypeReservaOcupadaModal}
    casillero={casilleroReserva}
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
  return luminance > 0.5 ? '#000' : '#FFF';
}




export default CasillerosPages;