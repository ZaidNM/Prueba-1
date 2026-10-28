import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../modules/auth/context/auth.context.jsx'

export default function Layout() {
    const { token, logout } = useAuth()
    const navigate = useNavigate()

    const salir = () => {
        logout()
        navigate('/')
    }

    const enlace = ({ isActive }) =>
        `rounded-lg px-3 py-1.5 text-sm transition ${
            isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
        }`

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/90 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
                    <Link to="/" className="text-lg font-bold tracking-tight text-white">
                        Auto<span className="text-amber-400">Hub</span>
                    </Link>

                    <nav className="flex items-center gap-1">
                        <NavLink to="/" end className={enlace}>
                            Catálogo
                        </NavLink>
                        <NavLink to="/admin" className={enlace}>
                            Panel
                        </NavLink>
                        {token ? (
                            <button
                                onClick={salir}
                                className="ml-1 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-white/5"
                            >
                                Salir
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="ml-1 rounded-lg bg-amber-400 px-3 py-1.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
                            >
                                Entrar
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
                <Outlet />
            </main>

        </div>
    )
}
