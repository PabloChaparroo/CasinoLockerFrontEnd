import { Route, Routes } from "react-router-dom";
import HomePage from "../Pages/HomePage";
import CasillerosPages from "../Pages/CasillerosPages";
import PerchasPages from "../Pages/PerchasPages";
import { AbmCasillerosPage } from "../Pages/AbmCasillerosPage";
import AbmPerchasPage from "../Pages/AbmPerchasPage";
import AbmTipoCasilleroPage from "../Pages/AbmTipoCasilleroPage";
import AbmUsuarioPage from "../Pages/AbmUsuarioPage";
import AbmEstadoCasilleroPerchaPage from "../Pages/AbmEstadoCasilleroPerchaPage";
import ClientesPages from "../Pages/ClientesPages";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";
import PerfilPage from "../Pages/PerfilPage";


const AppRoutes: React.FC = () => {
    return (
        <Routes>
            
            <Route path="/" element={<HomePage/>}/>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registrarse" element={<RegisterPage />} />
            <Route path="/perfil" element={<PerfilPage/>} />
            <Route path="/casilleros" element={<CasillerosPages/>}/>
            <Route path="/perchas" element={<PerchasPages/>}/>
            <Route path="/clientes" element={<ClientesPages/>}/>
            <Route path="/abmCasilleros" element={<AbmCasillerosPage/>}/>
            <Route path="/abmPerchas" element={<AbmPerchasPage/>}/>
            <Route path="/abmTipoCasilleros" element={<AbmTipoCasilleroPage/>}/>
            <Route path="/abmEstadoCasilleroPercha" element={<AbmEstadoCasilleroPerchaPage/>}/>
            <Route path="/abmUsuarios" element={<AbmUsuarioPage/>}/>
            




        </Routes>    
    )
}
export default AppRoutes;