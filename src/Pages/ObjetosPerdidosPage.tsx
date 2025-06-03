import { useEffect, useState } from "react";
import { CasilleroService } from "../Services/CasilleroService";
import { ConfObjetoPerdidoService } from "../Services/confObjetoPerdidoService";
import type { Casillero } from "../Types/Casillero";
import type { ConfObjetoPerdidoDetalle } from "../Types/ConfObjetoPerdidoDetalle";
import ObjetoPerdidoModal from "../Components/CasilleroObjetosPerdidosModal/CasilleroObjetosPerdidosModal";
import "./ObjetosPerdidosPage.css";

const ObjetosPerdidosPage = () => {
  const [casilleros, setCasilleros] = useState<Casillero[]>([]);
  const [loading, setLoading] = useState(true);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState<ConfObjetoPerdidoDetalle | null>(null);

  useEffect(() => {
    const fetchCasilleros = async () => {
      try {
        const data = await CasilleroService.getCasillerosObjetoPerdido();
        setCasilleros(data);
      } catch (error) {
        console.error("Error al cargar los casilleros de objetos perdidos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCasilleros();
  }, []);

  const handleClickCasillero = async (idCasillero: number) => {
    try {
      const detalle = await ConfObjetoPerdidoService.obtenerDetallePorIdCasillero(idCasillero);
      setDetalleSeleccionado(detalle);
    } catch (error) {
      console.error("Error al obtener el detalle del casillero:", error);
    }
  };

  const handleCloseModal = () => {
    setDetalleSeleccionado(null);
  };

  return (
    <div className="objetos-container">
      <div className="header-section">
        <h2 className="page-title">Objetos Perdidos</h2>
      </div>

      <div className="page-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Cargando casilleros...</p>
          </div>
        ) : (
          <div className="objetos-grid">
            {casilleros.map((casillero) => (
              <div
                key={casillero.id}
                className="objeto-card"
                onClick={() => handleClickCasillero(casillero.id!)}
                style={{
                  "--estado-color":
                    casillero.estadoCasilleroPercha?.colorEstadoCasilleroPercha || "#3498db",
                } as React.CSSProperties}
              >
                <h3 className="objeto-header">Casillero #{casillero.numeroCasillero}</h3>
                <p className="objeto-info">
                  Id: {casillero.id ?? "Sin ID"}
                </p>
                <span className="estado-badge">
                  {casillero.estadoCasilleroPercha?.nombreEstadoCasilleroPercha ?? "Sin estado"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {detalleSeleccionado && (
        <ObjetoPerdidoModal detalle={detalleSeleccionado} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ObjetosPerdidosPage;