import { useState } from "react";
import { Nav } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../FilterBar/FilterBar";
import "./SideBar.css";
import { FaHome } from 'react-icons/fa';
import { TbHanger } from "react-icons/tb";
import { PiLockersBold } from "react-icons/pi";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { TbUsersGroup } from "react-icons/tb";
import { useJornada } from "../../context/JornadaContext";


const Sidebar = () => {
  const navigate = useNavigate();
  const { mostrarJornada, setMostrarJornada } = useJornada();

  const handleJornadaClick = () => {
    if (!mostrarJornada) {
      setMostrarJornada(true);
    } else {
      navigate("/finalizar-jornada");
    }
  };

  return (
    <div className="sidebar-container">
      <h4 className="sidebar-title">CasinoLocker</h4>

      <button
        onClick={handleJornadaClick}
        className={`jornada-button ${mostrarJornada ? "jornada-activa" : ""}`}
      >
        {mostrarJornada ? "Terminar Jornada" : "Comenzar Jornada"}
      </button>

      <Nav className="flex-column">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <FaHome className="sidebar-icon" />
          Home
        </NavLink>

        {mostrarJornada && (
          <>
            <NavLink 
              to="/api/casilleros" 
              className={({ isActive }) => 
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <PiLockersBold className="sidebar-icon" />
              Casilleros
            </NavLink>

            <NavLink 
              to="/api/perchas" 
              className={({ isActive }) => 
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <TbHanger className="sidebar-icon" />
              Perchas
            </NavLink>
          </>
        )}
        <NavLink 
          to="/objetos-perdidos" 
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
        >
          <PiLockersBold className="sidebar-icon" />
          Objetos Perdidos
        </NavLink>
        <NavLink 
          to="/clientes" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <TbUsersGroup className="sidebar-icon" />
          Clientes
        </NavLink>

        <NavLink to="/abmCasilleros" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <HiOutlineClipboardDocumentList className="sidebar-icon" />
          ABM Casilleros
        </NavLink>

        <NavLink to="/abmPerchas" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <HiOutlineClipboardDocumentList className="sidebar-icon" />
          ABM Perchas
        </NavLink>

        <NavLink to="/abmTipoCasilleros" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <HiOutlineClipboardDocumentList className="sidebar-icon" />
          ABM Tipo Casilleros
        </NavLink>

        <NavLink to="/abmEstadoCasilleroPercha" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <HiOutlineClipboardDocumentList className="sidebar-icon" />
          ABM Estados Casilleros/Perchas
        </NavLink>

        <NavLink to="/abmUsuarios" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <TbUsersGroup className="sidebar-icon" />
          ABM Usuarios
        </NavLink>
      </Nav>
    </div>
  );
};

export default Sidebar;