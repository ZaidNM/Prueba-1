import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCoche } from '../api/coches.api.js'
import { useAuth } from '../../auth/context/auth.context.jsx'
import { combustible, precio } from '../../../format.js'
import { btnGhost } from '../../../ui.js'

export default function DetalleCoche() {
    const { id } = useParams()
    const { token } = useAuth()
    const [coche, setCoche] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        let vigente = true
        setCoche(null)
        setError('')

        getCoche(id)
            .then((datos) => vigente && setCoche(datos))
            .catch((fallo) =>
                vigente && setError(fallo.status === 404 ? 'Ese coche no existe.' : fallo.message)
            )

        return () => {
            vigente = false
        }
    }, [id])

    if (error) {
        return (
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-10 text-center">
                <p className="text-slate-300">{error}</p>
                <Link to="/" className={`${btnGhost} mt-4`}>
                    Volver al catálogo
                </Link>
            </div>
        )
    }

    if (!coche) {
        return (
            <div className="grid gap-8 lg:grid-cols-2">
                <div className="aspect-[16/10] animate-pulse rounded-xl bg-slate-900" />
                <div className="space-y-4">
                    <div className="h-6 w-24 animate-pulse rounded bg-slate-900" />
                    <div className="h-10 w-2/3 animate-pulse rounded bg-slate-900" />
                    <div className="h-32 animate-pulse rounded bg-slate-900" />
                </div>
            </div>
        )
    }

    const ficha = [
        ['Marca', coche.marca.nombre],
        ['Año', coche.anio],
        ['Color', coche.color],
        ['Puertas', coche.puertas],
        ['Combustible', combustible(coche.combustible)],
        ['Código', `#${coche.id}`]
    ]

    return (
        <div>
            <Link to="/" className="text-sm text-slate-400 transition hover:text-white">
                ← Volver al catálogo
            </Link>

            <div className="mt-4 grid gap-8 lg:grid-cols-2">
                <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                    {coche.imagen ? (
                        <img
                            src={coche.imagen}
                            alt={`${coche.marca.nombre} ${coche.modelo}`}
                            className="aspect-[16/10] w-full object-cover"
                        />
                    ) : (
                        <div className="grid aspect-[16/10] place-items-center text-slate-600">Sin imagen</div>
                    )}
                </div>

                <div>
                    <p className="text-sm font-medium uppercase tracking-wide text-amber-400">
                        {coche.marca.nombre}
                    </p>
                    <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">{coche.modelo}</h1>
                    <p className="mt-2 text-sm text-slate-400">
                        {coche.anio} · {combustible(coche.combustible)}
                    </p>

                    <p className="mt-6 text-3xl font-bold text-white">{precio(coche.precio)}</p>

                    <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                        {ficha.map(([etiqueta, valor]) => (
                            <div key={etiqueta}>
                                <dt className="text-xs uppercase tracking-wide text-slate-500">{etiqueta}</dt>
                                <dd className="mt-1 text-sm font-medium text-slate-100">{valor}</dd>
                            </div>
                        ))}
                    </dl>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link to={`/?marca=${coche.marcaId}`} className={btnGhost}>
                            Ver más de {coche.marca.nombre}
                        </Link>
                        {token && (
                            <Link to={`/admin/coches/${coche.id}`} className={btnGhost}>
                                Editar coche
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
