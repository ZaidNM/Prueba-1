import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth.context.jsx'
import { btn, input, label } from '../../../ui.js'

export default function Login() {
    const { token, login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)

    const enviar = async (evento) => {
        evento.preventDefault()
        const datos = new FormData(evento.currentTarget)

        setCargando(true)
        setError('')

        try {
            await login(datos.get('email'), datos.get('password'))
            navigate(location.state?.from?.pathname ?? '/admin', { replace: true })
        } catch (fallo) {
            setError(fallo.message)
        } finally {
            setCargando(false)
        }
    }

    if (token) return <Navigate to="/admin" replace />

    return (
        <div className="mx-auto max-w-sm">
            <h1 className="text-2xl font-bold text-white">Entrar al panel</h1>
            <p className="mt-1 text-sm text-slate-400">
                Necesitas una cuenta para crear, editar o eliminar coches.
            </p>

            <form onSubmit={enviar} className="mt-6 space-y-4 rounded-xl border border-white/10 bg-slate-900/60 p-6">
                <div>
                    <label className={label} htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        defaultValue="admin@prueba.com"
                        className={input}
                    />
                </div>

                <div>
                    <label className={label} htmlFor="password">
                        Contraseña
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        defaultValue="admin123"
                        className={input}
                    />
                </div>

                {error && (
                    <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                        {error}
                    </p>
                )}

                <button disabled={cargando} className={`${btn} w-full`}>
                    {cargando ? 'Entrando…' : 'Entrar'}
                </button>

                <p className="text-center text-xs text-slate-500">
                    Demo: admin@prueba.com / admin123
                </p>
            </form>
        </div>
    )
}
