import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../Services/AuthServices";
import './PerfilUsuario.css'; // Archivo CSS que crearemos después

const PerfilUsuario: React.FC = () => {
  const [usuario, setUsuario] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
      return;
    }
    
    const fetchUsuario = async () => {
      try {
        setIsLoading(true);
        const userData = await AuthService.getPerfil();
        setUsuario(userData);
      } catch {
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsuario();
  }, [navigate]);

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!usuario) return null;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{usuario.nombreUsuario.charAt(0).toUpperCase()}</span>
          </div>
          <h2>{usuario.nombreUsuario}</h2>
          <p className="profile-username">@{usuario.username}</p>
        </div>
        
        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value">{usuario.emailUsuario}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Teléfono</span>
            <span className="detail-value">{usuario.telefonoUsuario}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">DNI</span>
            <span className="detail-value">{usuario.dniUsuario}</span>
          </div>
        </div>
        
        <div className="profile-actions">
          <button 
            className="logout-button"
            onClick={handleLogout}
          >
            <span>Cerrar sesión</span>
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;