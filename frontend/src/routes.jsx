import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Catalogo from './modules/coches/pages/Catalogo.jsx'
import DetalleCoche from './modules/coches/pages/DetalleCoche.jsx'
import Login from './modules/auth/pages/Login.jsx'
import Admin from './modules/admin/pages/Admin.jsx'
import AdminCoche from './modules/admin/pages/AdminCoche.jsx'
import { RequireAuth } from './modules/auth/context/auth.context.jsx'

export default function Rutas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<Catalogo />} />
                    <Route path="coches/:id" element={<DetalleCoche />} />
                    <Route path="login" element={<Login />} />
                    <Route
                        path="admin"
                        element={
                            <RequireAuth>
                                <Admin />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="admin/coches/:id"
                        element={
                            <RequireAuth>
                                <AdminCoche />
                            </RequireAuth>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
