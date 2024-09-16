import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Products from './pages/Products/Products'
import Recetas from './pages/Recetas/Recetas'
import Rendimiento from './pages/Rendimiento/Rendimiento'
import Buzon from './pages/Buzon/Buzon'
import Users from './pages/Users/Users'
import Configuration from './pages/Config/Configuration'
import ProtectedRoutes from './components/ProtectedRoutes'
import NotFound from './components/NotFound'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './assets/css/styles.css'

function App() {

  const permission = 1;

  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/" element={<Login></Login>} />
          <Route path="/register" element={<Register></Register>} />
        </Route>
        <Route element={<ProtectedRoutes isAuth={true} redirectTo="/login" />}>
          <Route path="/products" element={<Products></Products>} />
          <Route path="/buzon" element={<Buzon></Buzon>} />
        </Route>
        <Route path="/recetas" element={
          <ProtectedRoutes isAuth={true && (permission == 1 || permission == 10)} redirectTo="/products">
            <Recetas></Recetas>
          </ProtectedRoutes>}
        />
        <Route path="/rendimiento" element={
          <ProtectedRoutes isAuth={true && (permission == 2 || permission == 10)} redirectTo="/products">
            <Rendimiento></Rendimiento>
          </ProtectedRoutes>}
        />
        <Route path="/users" element={
          <ProtectedRoutes isAuth={true && permission == 10} redirectTo="/products">
            <Users></Users>
          </ProtectedRoutes>}
        />
        <Route path="/configuration" element={
          <ProtectedRoutes isAuth={true && permission == 10} redirectTo="/products">
            <Configuration></Configuration>
          </ProtectedRoutes>}
        />
        <Route path="*" element={<NotFound></NotFound>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
