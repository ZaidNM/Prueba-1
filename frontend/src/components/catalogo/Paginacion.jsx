import { btnGhost } from '../../ui.js'

export default function Paginacion({ meta, onCambiar }) {
    if (meta.totalPages <= 1) return null

    return (
        <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Paginación">
            <button
                onClick={() => onCambiar(meta.page - 1)}
                disabled={meta.page <= 1}
                className={`${btnGhost} disabled:cursor-not-allowed disabled:opacity-40`}
            >
                Anterior
            </button>
            <span className="text-sm text-slate-400">
                Página {meta.page} de {meta.totalPages}
            </span>
            <button
                onClick={() => onCambiar(meta.page + 1)}
                disabled={meta.page >= meta.totalPages}
                className={`${btnGhost} disabled:cursor-not-allowed disabled:opacity-40`}
            >
                Siguiente
            </button>
        </nav>
    )
}
