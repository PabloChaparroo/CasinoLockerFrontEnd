// FilterBar.tsx
import React, { useState, useEffect } from "react";
import "../FilterBar/FilterBar.css"
import { useEstadosCasillero } from "../Hooks/UseEstadoCasillero";


interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  activeFilter, 
  onFilterChange 
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { estados, loading, error } = useEstadosCasillero();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return <div className="filter-bar-loading">Cargando filtros...</div>;
  if (error) return <div className="filter-bar-error">{error}</div>;

  return (
    <>
      {isMobile && (
        <button 
          className="menu-toggle"
          onClick={() => setDrawerOpen(!drawerOpen)}
          style={{ top: '100px' }}
        >
          {drawerOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#1976d2" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="#1976d2" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      )}

      <div className={`filter-bar ${isMobile ? "mobile" : ""} ${drawerOpen ? "open" : ""}`}>
        {estados.map((filter) => (
          <button
            key={filter}
            className={`filter-button ${activeFilter === filter ? "active" : ""}`}
            onClick={() => {
              onFilterChange(filter);
              if (isMobile) setDrawerOpen(false);
            }}
          >
            {filter}
          </button>
        ))}
      </div>
    </>
  );
};

export default FilterBar;