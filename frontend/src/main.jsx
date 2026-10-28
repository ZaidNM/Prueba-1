import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Rutas from './routes.jsx'
import { AuthProvider } from './modules/auth/context/auth.context.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <Rutas />
        </AuthProvider>
    </StrictMode>
)
