import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

const Header = () => {

    const navigate = useNavigate();

  useEffect(() => {
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);

    const googleFontsLink = document.createElement('link');
    googleFontsLink.rel = 'stylesheet';
    googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    document.head.appendChild(googleFontsLink);

    return () => {
      document.head.removeChild(fontAwesomeLink);
      document.head.removeChild(googleFontsLink);
    };
  }, []);

  return (
   <>
   
   {/* Topbar */}
      <div className="container-fluid bg-light pt-2 d-none d-lg-block">
  <div className="container">
    <div className="row align-items-center justify-content-between">
      <div className="col-lg-6 text-lg-left mb-2 mb-lg-0">
        <div className="d-inline-flex align-items-center">
          <p className="m-0"><i className="fa fa-envelope mr-2"></i>info@example.com</p>
          <p className="m-0 ml-3"><i className="fa fa-phone-alt mr-2"></i>+012 345 6789</p>
        </div>
      </div>
      <div className="col-lg-6 text-lg-right mb-2 mb-lg-0">
        <div className="d-inline-flex align-items-center justify-content-end">
          <a className="text-primary px-3" href="#">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a className="text-primary px-3" href="#">
            <i className="fab fa-twitter"></i>
          </a>
          <a className="text-primary px-3" href="#">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a className="text-primary px-3" href="#">
            <i className="fab fa-instagram"></i>
          </a>
          <a className="text-primary px-3" href="#">
            <i className="fab fa-youtube"></i>
          </a>
          {!localStorage.getItem("token") && (
            <Button onClick={() => navigate("/login")} className="btn btn-primary ml-3">
              Iniciar sesión
            </Button>
          )}
        </div>
      </div>
    </div>
  </div>
</div>
      {/* End Topbar */}
   
   </>
  )
}

export default Header