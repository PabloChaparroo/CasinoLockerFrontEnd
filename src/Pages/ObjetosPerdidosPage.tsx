import { useEffect, useState } from "react";
import { CasilleroService } from "../Services/CasilleroService";
import type { Casillero } from "../Types/Casillero";
import "./ObjetosPerdidosPage.css";

const ObjetosPerdidosPage = () => {
  const [casilleros, setCasilleros] = useState<Casillero[]>([]);
  const [loading, setLoading] = useState(true);

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
                    {casillero.estadoCasilleroPercha?.nombreEstadoCasilleroPercha ??
                      "Sin estado"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

  );
};

export default ObjetosPerdidosPage;