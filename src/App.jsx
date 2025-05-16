import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Products from './pages/Products/Products'
import Recetas from './pages/Recetas/Recetas'
import AddReceta from "./pages/Recetas/AddReceta"
import Rendimiento from './pages/Rendimiento/Rendimiento'
import ChatWindow from "./components/ChatWindow"
import UserChat from "./components/UserChat"
import Users from './pages/Users/Users'
import Configuration from './pages/Config/Configuration'
import Logout from "./pages/Auth/Logout"
import ProtectedRoutes from './components/ProtectedRoutes'
import NotFound from './components/NotFound'
import MainLayout from "./layout/MainLayout"
import { jwtDecode } from 'jwt-decode'
import { validarToken } from "./utils/validarToken"

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './assets/css/styles.css'
import { Navigate } from "react-router-dom"

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  
  const [isAuth, setIsAuth] = useState(validarToken()); // Estado que se actualiza según el token

  useEffect(() => {
    // Actualiza isAuth cuando el token cambie
    const interval = setInterval(() => {
      setIsAuth(validarToken());
    }, 1000); // Se verifica cada segundo para mantener el estado actualizado

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonte
  }, []); // Solo se ejecuta una vez al montarse
  
  const token = JSON.parse(localStorage.getItem("token"));
  const user = token ? jwtDecode(token) : {}
  const permission = user?.user?.type

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path="/" element={isAuth ? <Navigate to="/products" /> : <Login />} />
            <Route path="/register" element={<Register></Register>} />
            <Route path="/logout" element={<Logout></Logout>} />
          </Route>
          <Route element={<MainLayout></MainLayout>}>
            <Route element={<ProtectedRoutes isAuth={isAuth} redirectTo="/" />}>
              <Route path="/products" element={<Products></Products>} />
              <Route path="/buzon" 
                element={
                  user?.user?.idusers === 1 ? <ChatWindow userId={user?.user?.idusers} /> : <UserChat userId={user?.user?.idusers} />
                } 
              />
            </Route>
            <Route path="/recetas" element={
              <ProtectedRoutes isAuth={isAuth && (permission == 1 || permission == 10)} redirectTo="/products">
                <Recetas></Recetas>
              </ProtectedRoutes>}
            />
            <Route path="/recetas/addreceta" element={
              <ProtectedRoutes isAuth={isAuth && (permission == 1 || permission == 10)} redirectTo="/products">
                <AddReceta></AddReceta>
              </ProtectedRoutes>}
            />
            <Route path="/rendimiento" element={
              <ProtectedRoutes isAuth={isAuth && (permission == 2 || permission == 10)} redirectTo="/products">
                <Rendimiento></Rendimiento>
              </ProtectedRoutes>}
            />
            <Route path="/users" element={
              <ProtectedRoutes isAuth={isAuth && permission == 10} redirectTo="/products">
                <Users></Users>
              </ProtectedRoutes>}
            />
            <Route path="/configuration" element={
              <ProtectedRoutes isAuth={isAuth && permission == 10} redirectTo="/products">
                <Configuration></Configuration>
              </ProtectedRoutes>}
            />
            <Route path="*" element={<NotFound></NotFound>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
