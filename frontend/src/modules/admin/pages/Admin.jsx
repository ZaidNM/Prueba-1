import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { eliminarCoche, getCoches } from '../../coches/api/coches.api.js'
import { useAuth } from '../../auth/context/auth.context.jsx'
import { precio } from '../../../format.js'
import { btn, btnGhost } from '../../../ui.js'

export default function Admin() {
    const { logout } = useAuth()
    const [coches, setCoches] = useState(null)
    const [error, setError] = useState('')
    const [borrando, setBorrando] = useState(0)

    const manejar = (fallo) => {
        if (fallo.status === 401) {
            logout()
            return
        }
        setError(fallo.message)
    }

    useEffect(() => {
        getCoches('limit=100&orden=recientes')
            .then((datos) => setCoches(datos.data))
            .catch(manejar)
    }, [])

    const eliminar = async (coche) => {
        if (!window.confirm(`¿Eliminar ${coche.marca.nombre} ${coche.modelo}?`)) return

        setBorrando(coche.id)

        try {
            await eliminarCoche(coche.id)
            setCoches((lista) => lista.filter((c) => c.id !== coche.id))
        } catch (fallo) {
            manejar(fallo)
        } finally {
            setBorrando(0)
        }
    }

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white">Panel de coches</h1>
                    <p className="mt-1 text-sm text-slate-400">
                        {coches ? `${coches.length} coches registrados` : 'Cargando…'}
                    </p>
                </div>
                <Link to="/admin/coches/nuevo" className={btn}>
                    + Nuevo coche
                </Link>
            </div>

            {error && (
                <p role="alert" className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                    {error}
                </p>
            )}

            {!coches && <div className="h-64 animate-pulse rounded-xl bg-slate-900" />}

            {coches?.length === 0 && (
                <p className="rounded-xl border border-white/10 bg-slate-900/60 p-10 text-center text-slate-400">
                    Todavía no hay coches. Crea el primero.
                </p>
            )}

            {coches?.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/60">
                    <table className="w-full min-w-[640px] text-left text-sm">
                        <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3 font-medium">Coche</th>
                                <th className="px-4 py-3 font-medium">Año</th>
                                <th className="px-4 py-3 font-medium">Precio</th>
                                <th className="px-4 py-3 text-right font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {coches.map((coche) => (
                                <tr key={coche.id} className="transition hover:bg-white/5">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={coche.imagen}
                                                alt={`${coche.marca.nombre} ${coche.modelo}`}
                                                className="h-10 w-16 rounded object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-white">{coche.modelo}</p>
                                                <p className="text-xs text-slate-400">{coche.marca.nombre}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-300">{coche.anio}</td>
                                    <td className="px-4 py-3 font-semibold text-white">{precio(coche.precio)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Link to={`/coches/${coche.id}`} className={btnGhost}>
                                                Ver
                                            </Link>
                                            <Link to={`/admin/coches/${coche.id}`} className={btnGhost}>
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => eliminar(coche)}
                                                disabled={borrando === coche.id}
                                                className={`${btnGhost} text-red-300 hover:bg-red-500/10 disabled:opacity-50`}
                                            >
                                                {borrando === coche.id ? '…' : 'Eliminar'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
