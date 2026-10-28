import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCoches, getMarcas } from '../api/coches.api.js'
import CocheCard from '../../../components/cards/CocheCard.jsx'
import Filtros from '../../../components/catalogo/Filtros.jsx'
import Paginacion from '../../../components/catalogo/Paginacion.jsx'

export default function Catalogo() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [pagina, setPagina] = useState(null)
    const [marcas, setMarcas] = useState([])
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(true)
    const [recarga, setRecarga] = useState(0)

    useEffect(() => {
        getMarcas().then(setMarcas).catch(() => {})
    }, [])

    useEffect(() => {
        let vigente = true
        setCargando(true)
        setError('')

        getCoches(searchParams)
            .then((datos) => vigente && setPagina(datos))
            .catch((fallo) => vigente && setError(fallo.message))
            .finally(() => vigente && setCargando(false))

        return () => {
            vigente = false
        }
    }, [searchParams, recarga])

    const cambiarPagina = (nueva) => {
        const siguientes = new URLSearchParams(searchParams)
        siguientes.set('page', nueva)
        setSearchParams(siguientes)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white sm:text-3xl">Catálogo de coches</h1>
                <p className="mt-1 text-sm text-slate-400">
                    {pagina ? `${pagina.meta.total} coches disponibles` : 'Cargando…'}
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
                <aside className="lg:sticky lg:top-20 lg:self-start">
                    <Filtros marcas={marcas} />
                </aside>

                <section>
                    {cargando && (
                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-72 animate-pulse rounded-xl bg-slate-900" />
                            ))}
                        </div>
                    )}

                    {!cargando && error && (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
                            <p>{error}</p>
                            <button onClick={() => setRecarga(recarga + 1)} className="mt-3 font-semibold underline">
                                Reintentar
                            </button>
                        </div>
                    )}

                    {!cargando && !error && pagina?.data.length === 0 && (
                        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-10 text-center text-slate-400">
                            No hay coches con esos filtros.
                        </div>
                    )}

                    {!cargando && !error && pagina?.data.length > 0 && (
                        <>
                            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                {pagina.data.map((coche) => (
                                    <CocheCard key={coche.id} coche={coche} />
                                ))}
                            </div>
                            <Paginacion meta={pagina.meta} onCambiar={cambiarPagina} />
                        </>
                    )}
                </section>
            </div>
        </div>
    )
}
