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



function App() {
  return (
    <>
      <ToastContainer/>
      <BrowserRouter>
        <Header /> {/* Header fijo en la parte superior */}
        <div className="app-layout">
          <SideBar /> {/* Sidebar debajo del Header */}
          <Container className="main-content">
            <Suspense fallback={<Loader />}>
              <AppRoutes />
            </Suspense>
          </Container>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;