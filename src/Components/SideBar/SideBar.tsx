
import { Nav } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import "../FilterBar/FilterBar"
import "./SideBar.css";
import { FaHome } from 'react-icons/fa';
import { TbHanger } from "react-icons/tb";
import { PiLockersBold } from "react-icons/pi";
import { RiProhibitedLine } from "react-icons/ri";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { TbUsersGroup } from "react-icons/tb";





const Sidebar = () => {
  const location = useLocation(); // Obtiene la ruta actual

  return (
    <div className="sidebar-container">
      <h4 className="sidebar-title">CasinoLocker</h4>

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
        
        <NavLink 
          to="/casilleros" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <PiLockersBold className="sidebar-icon" />
          Casilleros
        </NavLink>

        {/* Repite el mismo patrón para los demás enlaces */}
        <NavLink 
          to="/perchas" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <TbHanger className="sidebar-icon" />
          Perchas
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

        <NavLink 
          to="/abmCasilleros" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <HiOutlineClipboardDocumentList className="sidebar-icon" />
          ABM Casilleros
        </NavLink>

                  <NavLink 
          to="/abmPerchas" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <HiOutlineClipboardDocumentList className="sidebar-icon" />
          ABM Perchas
        </NavLink>

          <NavLink 
          to="/abmTipoCasilleros" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <HiOutlineClipboardDocumentList className="sidebar-icon" />
          ABM Tipo Casilleros
        </NavLink>

        <NavLink 
          to="/abmEstadoCasilleroPercha" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <HiOutlineClipboardDocumentList className="sidebar-icon" />
          ABM Estados Casilleros/Perchas
        </NavLink>

        <NavLink 
          to="/abmUsuarios" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <TbUsersGroup className="sidebar-icon" />
          ABM Usuarios
        </NavLink>




      </Nav>
    </div>
  );
};

export default Sidebar;