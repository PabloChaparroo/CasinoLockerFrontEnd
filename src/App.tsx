import { Suspense } from 'react';
import { Container, ToastContainer } from 'react-bootstrap';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './Components/Loader/Loader';
import AppRoutes from './Routes/AppRoutes';
import Header from './Components/Header/Header';
import './App.css'; 
import SideBar from './Components/SideBar/SideBar';


function App() {
  return (
    <>
      <ToastContainer />
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