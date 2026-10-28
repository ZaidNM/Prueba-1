import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { actualizarCoche, crearCoche, getCoche, getMarcas, subirImagen } from '../../coches/api/coches.api.js'
import { COMBUSTIBLES } from '../../../format.js'
import { btn, btnGhost, input, label } from '../../../ui.js'

const VACIO = {
    marcaId: '',
    modelo: '',
    anio: new Date().getFullYear(),
    precio: '',
    color: '',
    puertas: 4,
    combustible: 'gasolina',
    imagen: ''
}

export default function AdminCoche() {
    const { id } = useParams()
    const navigate = useNavigate()
    const esNuevo = id === 'nuevo'

    const [form, setForm] = useState(VACIO)
    const [marcas, setMarcas] = useState([])
    const [archivo, setArchivo] = useState(null)
    const [previa, setPrevia] = useState('')
    const [error, setError] = useState(null)
    const [guardando, setGuardando] = useState(false)

    useEffect(() => () => previa && URL.revokeObjectURL(previa), [previa])

    useEffect(() => {
        getMarcas()
            .then(setMarcas)
            .catch((fallo) => setError(fallo))
    }, [])

    useEffect(() => {
        if (esNuevo) return
        let vigente = true

        getCoche(id)
            .then((coche) => {
                if (!vigente) return
                setForm({
                    marcaId: coche.marcaId,
                    modelo: coche.modelo,
                    anio: coche.anio,
                    precio: coche.precio,
                    color: coche.color,
                    puertas: coche.puertas,
                    combustible: coche.combustible,
                    imagen: coche.imagen ?? ''
                })
            })
            .catch((fallo) => vigente && setError(fallo))

        return () => {
            vigente = false
        }
    }, [id, esNuevo])

    const cambiar = (evento) => {
        setForm({ ...form, [evento.target.name]: evento.target.value })
    }

    const cambiarArchivo = (evento) => {
        const seleccionado = evento.target.files?.[0] ?? null
        setArchivo(seleccionado)
        setPrevia(seleccionado ? URL.createObjectURL(seleccionado) : '')
    }

    const enviar = async (evento) => {
        evento.preventDefault()
        setGuardando(true)
        setError(null)

        try {
            const imagen = archivo ? (await subirImagen(archivo)).imagen : form.imagen

            const datos = {
                marcaId: Number(form.marcaId),
                modelo: form.modelo,
                anio: Number(form.anio),
                precio: Number(form.precio),
                color: form.color,
                puertas: Number(form.puertas),
                combustible: form.combustible,
                ...(imagen && { imagen })
            }

            if (esNuevo) await crearCoche(datos)
            else await actualizarCoche(id, datos)

            navigate('/admin')
        } catch (fallo) {
            setError(fallo)
        } finally {
            setGuardando(false)
        }
    }

    return (
        <div className="mx-auto max-w-2xl">
            <Link to="/admin" className="text-sm text-slate-400 transition hover:text-white">
                ← Volver al panel
            </Link>

            <h1 className="mt-2 text-2xl font-bold text-white">
                {esNuevo ? 'Nuevo coche' : `Editar coche #${id}`}
            </h1>

            <form onSubmit={enviar} className="mt-6 grid gap-4 rounded-xl border border-white/10 bg-slate-900/60 p-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label className={label} htmlFor="marcaId">
                        Marca
                    </label>
                    <select
                        id="marcaId"
                        name="marcaId"
                        value={form.marcaId}
                        onChange={cambiar}
                        required
                        className={input}
                    >
                        <option value="">Selecciona una marca</option>
                        {marcas.map((marca) => (
                            <option key={marca.id} value={marca.id}>
                                {marca.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className={label} htmlFor="modelo">
                        Modelo
                    </label>
                    <input
                        id="modelo"
                        name="modelo"
                        value={form.modelo}
                        onChange={cambiar}
                        required
                        maxLength={80}
                        className={input}
                    />
                </div>

                <div>
                    <label className={label} htmlFor="color">
                        Color
                    </label>
                    <input
                        id="color"
                        name="color"
                        value={form.color}
                        onChange={cambiar}
                        required
                        maxLength={30}
                        className={input}
                    />
                </div>

                <div>
                    <label className={label} htmlFor="anio">
                        Año
                    </label>
                    <input
                        id="anio"
                        name="anio"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        value={form.anio}
                        onChange={cambiar}
                        required
                        className={input}
                    />
                </div>

                <div>
                    <label className={label} htmlFor="precio">
                        Precio (S/)
                    </label>
                    <input
                        id="precio"
                        name="precio"
                        type="number"
                        min="1"
                        step="0.01"
                        value={form.precio}
                        onChange={cambiar}
                        required
                        className={input}
                    />
                </div>

                <div>
                    <label className={label} htmlFor="puertas">
                        Puertas
                    </label>
                    <input
                        id="puertas"
                        name="puertas"
                        type="number"
                        min="2"
                        max="6"
                        value={form.puertas}
                        onChange={cambiar}
                        required
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
                        value={form.combustible}
                        onChange={cambiar}
                        className={input}
                    >
                        {Object.entries(COMBUSTIBLES).map(([valor, texto]) => (
                            <option key={valor} value={valor}>
                                {texto}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="sm:col-span-2">
                    <label className={label} htmlFor="imagen">
                        Imagen
                    </label>
                    <input
                        id="imagen"
                        name="imagen"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                        onChange={cambiarArchivo}
                        required={esNuevo}
                        className="block w-full cursor-pointer rounded-lg border border-white/10 bg-slate-800/80 text-sm text-slate-400 file:mr-3 file:border-0 file:bg-amber-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
                    />
                    <p className="mt-1 text-xs text-slate-500">JPG, PNG, WEBP, GIF o AVIF. Máximo 5 MB.</p>
                    {(previa || form.imagen) && (
                        <img
                            src={previa || form.imagen}
                            alt="Vista previa"
                            className="mt-3 h-40 w-full rounded-lg object-cover"
                        />
                    )}
                </div>

                {error && (
                    <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300 sm:col-span-2">
                        <p>{error.message}</p>
                        {error.detalles && (
                            <ul className="mt-1 list-inside list-disc">
                                {error.detalles.map((detalle) => (
                                    <li key={detalle.campo}>
                                        {detalle.campo}: {detalle.mensaje}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                <div className="flex gap-3 sm:col-span-2">
                    <button disabled={guardando} className={btn}>
                        {guardando ? 'Guardando…' : esNuevo ? 'Crear coche' : 'Guardar cambios'}
                    </button>
                    <Link to="/admin" className={btnGhost}>
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    )
}
