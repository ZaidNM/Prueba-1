import { useSearchParams } from 'react-router-dom'
import { COMBUSTIBLES } from '../../format.js'
import { btn, btnGhost, input, label } from '../../ui.js'

export default function Filtros({ marcas }) {
    const [params, setParams] = useSearchParams()

    const aplicar = (evento) => {
        evento.preventDefault()

        const nuevos = new URLSearchParams()
        for (const [clave, valor] of new FormData(evento.currentTarget)) {
            if (valor !== '') nuevos.set(clave, valor)
        }
        setParams(nuevos)
    }

    return (
        <form
            onSubmit={aplicar}
            className="space-y-4 rounded-xl border border-white/10 bg-slate-900/60 p-4"
        >
            <div>
                <label className={label} htmlFor="q">
                    Buscar
                </label>
                <input
                    id="q"
                    name="q"
                    defaultValue={params.get('q') ?? ''}
                    placeholder="Modelo o color"
                    className={input}
                />
            </div>

            <div>
                <label className={label} htmlFor="marca">
                    Marca
                </label>
                <select id="marca" name="marca" defaultValue={params.get('marca') ?? ''} className={input}>
                    <option value="">Todas</option>
                    {marcas.map((marca) => (
                        <option key={marca.id} value={marca.id}>
                            {marca.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={label} htmlFor="precioMin">
                        Precio mín.
                    </label>
                    <input
                        id="precioMin"
                        name="precioMin"
                        type="number"
                        min="0"
                        defaultValue={params.get('precioMin') ?? ''}
                        placeholder="0"
                        className={input}
                    />
                </div>
                <div>
                    <label className={label} htmlFor="precioMax">
                        Precio máx.
                    </label>
                    <input
                        id="precioMax"
                        name="precioMax"
                        type="number"
                        min="0"
                        defaultValue={params.get('precioMax') ?? ''}
                        placeholder="500000"
                        className={input}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={label} htmlFor="anio">
                        Año
                    </label>
                    <input
                        id="anio"
                        name="anio"
                        type="number"
                        min="1900"
                        defaultValue={params.get('anio') ?? ''}
                        placeholder="2024"
                        className={input}
                    />
                </div>
                <div>
                    <label className={label} htmlFor="combustible">
                        Combustible
                    </label>
                    <select
                        id="combustible"
                        name="combustible"
                        defaultValue={params.get('combustible') ?? ''}
                        className={input}
                    >
                        <option value="">Todos</option>
                        {Object.entries(COMBUSTIBLES).map(([valor, texto]) => (
                            <option key={valor} value={valor}>
                                {texto}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className={label} htmlFor="orden">
                    Ordenar por
                </label>
                <select id="orden" name="orden" defaultValue={params.get('orden') ?? ''} className={input}>
                    <option value="">Más recientes</option>
                    <option value="precio_asc">Precio: menor a mayor</option>
                    <option value="precio_desc">Precio: mayor a menor</option>
                    <option value="anio_desc">Año: más nuevo</option>
                </select>
            </div>

            <div className="flex gap-2 pt-1">
                <button className={`${btn} flex-1`}>Filtrar</button>
                <button type="button" onClick={() => setParams({})} className={btnGhost}>
                    Limpiar
                </button>
            </div>
        </form>
    )
}
