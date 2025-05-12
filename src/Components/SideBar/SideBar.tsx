
import { Nav } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import "../FilterBar/FilterBar"
import "./SideBar.css";

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
          Home
        </NavLink>
        
        <NavLink 
          to="/casilleros" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          Casilleros
        </NavLink>

        {/* Repite el mismo patrón para los demás enlaces */}
        <NavLink 
          to="/perchas" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          Perchas
        </NavLink>

        <NavLink 
          to="/casillerosDeObjetosPerdidos" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          Casilleros De Objetos Perdidos
        </NavLink>

        <NavLink 
          to="/abmCasilleros" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          ABM Casilleros
        </NavLink>

                  <NavLink 
          to="/abmPerchas" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          ABM Perchas
        </NavLink>

                <NavLink 
          to="/abmTipoCasilleros" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          ABM Tipo Casilleros
        </NavLink>

                <NavLink 
          to="/abmUsuarios" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          ABM Usuarios
        </NavLink>
      </Nav>
    </div>
  );
};

export default Sidebar;