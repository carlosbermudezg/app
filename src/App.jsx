import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Products from './pages/Products/Products'
import Recetas from './pages/Recetas/Recetas'
import AddReceta from "./pages/Recetas/AddReceta"
import Rendimiento from './pages/Rendimiento/Rendimiento'
import Buzon from './pages/Buzon/Buzon'
import Users from './pages/Users/Users'
import Configuration from './pages/Config/Configuration'
import Logout from "./pages/Auth/Logout"
import ProtectedRoutes from './components/ProtectedRoutes'
import NotFound from './components/NotFound'
import MainLayout from "./layout/MainLayout"

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './assets/css/styles.css'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { useSelector } from "react-redux"

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {

  const user = JSON.parse(localStorage.getItem("user"));
  const permission = user?.user.type
  const isAuth = useSelector( state => state.isAuth )
  const userData = useSelector( state => state.userData )

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path="/" element={<Login></Login>} />
            <Route path="/register" element={<Register></Register>} />
            <Route path="/logout" element={<Logout></Logout>} />
          </Route>
          <Route element={<MainLayout></MainLayout>}>
            <Route element={<ProtectedRoutes isAuth={isAuth} redirectTo="/" />}>
              <Route path="/products" element={<Products></Products>} />
              <Route path="/buzon" element={<Buzon></Buzon>} />
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
