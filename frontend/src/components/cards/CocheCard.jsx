import { Link } from 'react-router-dom'
import { combustible, precio } from '../../format.js'

export default function CocheCard({ coche }) {
    const nombre = `${coche.marca.nombre} ${coche.modelo}`

    return (
        <Link
            to={`/coches/${coche.id}`}
            className="group overflow-hidden rounded-xl border border-white/10 bg-slate-900/60 transition hover:border-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
            <div className="aspect-[16/10] overflow-hidden bg-slate-800">
                {coche.imagen ? (
                    <img
                        src={coche.imagen}
                        alt={nombre}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="grid h-full place-items-center text-sm text-slate-600">Sin imagen</div>
                )}
            </div>

            <div className="space-y-1 p-4">
                <p className="text-xs uppercase tracking-wide text-amber-400">{coche.marca.nombre}</p>
                <h3 className="font-semibold text-white">{coche.modelo}</h3>
                <p className="text-xs text-slate-400">
                    {coche.anio} · {combustible(coche.combustible)} · {coche.puertas} puertas
                </p>
                <p className="pt-2 text-lg font-bold text-white">{precio(coche.precio)}</p>
            </div>
        </Link>
    )
}
