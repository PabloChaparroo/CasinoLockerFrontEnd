import React from 'react';
import { useNavigate } from 'react-router-dom';
import imagen from './home-foto.png';
import logo from './logo.png';
import './HomePage.css';

const features = [
  { icon: "📦", title: "Inventario en tiempo real", desc: "Sigue la salida y entrada de objetos al instante." },
  { icon: "🔒", title: "Seguridad", desc: "Controla el acceso a los armarios de forma confiable." },
  { icon: "⚡", title: "Rápido y fácil", desc: "Interfaz intuitiva para todos los empleados." },
  { icon: "⚙️", title: "Totalmente configurable", desc: "ABMs para personalizar objetos, casilleros y usuarios a tu medida." },
  { icon: "📊", title: "Informes automáticos", desc: "Genera reportes detallados y personalizados con un clic." },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
    <div className="homepage-wrapper">
      <div className="homepage-container">
        <img src={logo} alt="Casino Locker Logo" className="homepage-logo" />
        <h1 className="homepage-title">Casino Locker</h1>
        <p className="homepage-subtitle">
          Organiza la salida y entrada de objetos de manera rápida y segura.
        </p>
        <img src={imagen} alt="Imagen descriptiva" className="homepage-image" />

        <section className="features-section">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="feature-card">
              <div className="feature-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </section>

        <button className="homepage-button" onClick={() => navigate('/auth/login')}>
          Comenzar
        </button>
      </div>

      <footer className="homepage-footer">
        <div className="footer-content">
          <p>Soporte: <a href="mailto:soporte@casinolocker.com">soporte@casinolocker.com</a></p>
          <nav className="footer-nav">
            <a href="/privacidad">Política de privacidad</a>
            <a href="/terminos">Términos y condiciones</a>
            <a href="/contacto">Contacto</a>
          </nav>
          <p className="copyright">
            &copy; {new Date().getFullYear()} Casino Locker. Todos los derechos reservados.
          </p>
        </div>
      </footer>
      </div>
    </>
  );
};

export default HomePage;