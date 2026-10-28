import { createContext, useContext, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { loginRequest } from '../api/auth.api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token'))

    const login = async (email, password) => {
        const datos = await loginRequest(email, password)
        localStorage.setItem('token', datos.token)
        setToken(datos.token)
        return datos
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
    }

    return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

// Guard: sin token no se entra al panel
export function RequireAuth({ children }) {
    const { token } = useAuth()
    const location = useLocation()

    if (!token) return <Navigate to="/login" state={{ from: location }} replace />

    return children
}
