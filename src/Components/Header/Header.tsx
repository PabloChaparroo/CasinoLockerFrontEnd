import './Header.css';
import logo from './Logo.png';
import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const fontAwesomeLink = document.createElement('link')
    fontAwesomeLink.rel = 'stylesheet'
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css'
    document.head.appendChild(fontAwesomeLink)

    const googleFontsLink = document.createElement('link')
    googleFontsLink.rel = 'stylesheet'
    googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
    document.head.appendChild(googleFontsLink)

    return () => {
      document.head.removeChild(fontAwesomeLink)
      document.head.removeChild(googleFontsLink)
    }
  }, [])

  return (
    <div className="header-bar d-flex justify-content-between align-items-center px-4 py-2 shadow-custom">
  <div className="d-flex align-items-center">
    <img src={logo} alt="Logo" className="header-logo me-3 rounded" />
    <span className="app-title">CasinoLocker</span>
  </div>

  <div className="d-flex align-items-center">
    <i className="fas fa-user-circle fa-lg me-2 text-white"></i>
    {localStorage.getItem('token') ? (
      <span className="user-label text-white">Recepcionista: Juan Carlos</span>
    ) : (
      <Button onClick={() => navigate('/login')} className="btn-outline-light-custom btn-sm">
        Iniciar sesión
      </Button>
    )}
  </div>
</div>
  )
}

export default Header