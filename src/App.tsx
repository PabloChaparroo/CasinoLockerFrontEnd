import { Suspense } from 'react'; 
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import Loader from './Components/Loader/Loader';
import AppRoutes from './Routes/AppRoutes';
import Header from './Components/Header/Header';
import './App.css'; 
import SideBar from './Components/SideBar/SideBar';
import 'react-toastify/dist/ReactToastify.css'
import { JornadaProvider } from "./context/JornadaContext";


function App() {
  return (
    <JornadaProvider>
      <ToastContainer />
        <BrowserRouter>
          <div className="app-wrapper"> {/* Contenedor global centrado */}
            <Header />
            <div className="app-layout">
              <SideBar />
              <div className="main-content">
                <Suspense fallback={<Loader />}>
                  <AppRoutes />
                </Suspense>
              </div>
            </div>
          </div>
        </BrowserRouter>
    </JornadaProvider>
  );
}

export default App;