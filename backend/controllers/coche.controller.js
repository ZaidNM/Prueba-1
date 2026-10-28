import { pool } from '../db.js'
import { aCoche, SELECT_COCHE } from '../helpers/coche.helper.js'
import { cocheQuerySchema, cocheSchema, cocheUpdateSchema } from '../validators/coche.validator.js'

const ORDENES = {
    recientes: 'c.id DESC',
    precio_asc: 'c.precio ASC',
    precio_desc: 'c.precio DESC',
    anio_desc: 'c.anio DESC'
}

const COLUMNAS = {
    marcaId: 'marca_id',
    modelo: 'modelo',
    anio: 'anio',
    precio: 'precio',
    color: 'color',
    puertas: 'puertas',
    combustible: 'combustible',
    imagen: 'imagen'
}

const buscarCoche = async (id) => {
    const [filas] = await pool.query(`${SELECT_COCHE} WHERE c.id = ?`, [id])
    return filas[0] ? aCoche(filas[0]) : null
}

const marcaExiste = async (id) => {
    const [filas] = await pool.query('SELECT id FROM marcas WHERE id = ?', [id])
    return filas.length > 0
}

// GET /api/coches?page=1&limit=10&marca=1&precioMin=&precioMax=&anio=&combustible=&q=&orden=
export const getCoches = async (req, res) => {
    const query = Object.fromEntries(Object.entries(req.query).filter(([, valor]) => valor !== ''))
    const { page, limit, marca, precioMin, precioMax, anio, combustible, q, orden } =
        cocheQuerySchema.parse(query)

    const condiciones = []
    const valores = []

    if (combustible) {
        condiciones.push('c.combustible = ?')
        valores.push(combustible)
    }
    if (anio) {
        condiciones.push('c.anio = ?')
        valores.push(anio)
    }
    if (precioMin !== undefined) {
        condiciones.push('c.precio >= ?')
        valores.push(precioMin)
    }
    if (precioMax !== undefined) {
        condiciones.push('c.precio <= ?')
        valores.push(precioMax)
    }
    if (marca) {
        if (/^\d+$/.test(marca)) {
            condiciones.push('c.marca_id = ?')
            valores.push(Number(marca))
        } else {
            condiciones.push('m.nombre LIKE ?')
            valores.push(`%${marca}%`)
        }
    }
    if (q) {
        condiciones.push('(c.modelo LIKE ? OR c.color LIKE ?)')
        valores.push(`%${q}%`, `%${q}%`)
    }

    const filtro = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : ''

    const [filas] = await pool.query(
        `${SELECT_COCHE} ${filtro} ORDER BY ${ORDENES[orden]} LIMIT ? OFFSET ?`,
        [...valores, limit, (page - 1) * limit]
    )
    const [[{ total }]] = await pool.query(
        `SELECT COUNT(*) AS total
         FROM coches c JOIN marcas m ON m.id = c.marca_id
         ${filtro}`,
        valores
    )

    res.json({
        data: filas.map(aCoche),
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
}

export const getCoche = async (req, res) => {
    const coche = await buscarCoche(req.id)

    if (!coche) return res.status(404).json({ error: 'Coche no encontrado' })

    res.json(coche)
}

export const createCoche = async (req, res) => {
    const datos = cocheSchema.parse(req.body)

    if (!(await marcaExiste(datos.marcaId))) {
        return res.status(400).json({ error: 'La marca no existe' })
    }

    const [resultado] = await pool.query(
        `INSERT INTO coches (marca_id, modelo, anio, precio, color, puertas, combustible, imagen)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            datos.marcaId,
            datos.modelo,
            datos.anio,
            datos.precio,
            datos.color,
            datos.puertas,
            datos.combustible,
            datos.imagen ?? null
        ]
    )

    res.status(201).json(await buscarCoche(resultado.insertId))
}

export const updateCoche = async (req, res) => {
    if (!(await buscarCoche(req.id))) {
        return res.status(404).json({ error: 'Coche no encontrado' })
    }

    const datos = cocheUpdateSchema.parse(req.body)

    if (datos.marcaId && !(await marcaExiste(datos.marcaId))) {
        return res.status(400).json({ error: 'La marca no existe' })
    }

    const campos = []
    const valores = []

    for (const [clave, valor] of Object.entries(datos)) {
        campos.push(`${COLUMNAS[clave]} = ?`)
        valores.push(valor)
    }

    if (campos.length) {
        await pool.query(`UPDATE coches SET ${campos.join(', ')} WHERE id = ?`, [...valores, req.id])
    }

    res.json(await buscarCoche(req.id))
}

export const deleteCoche = async (req, res) => {
    const [resultado] = await pool.query('DELETE FROM coches WHERE id = ?', [req.id])

    if (!resultado.affectedRows) {
        return res.status(404).json({ error: 'Coche no encontrado' })
    }

    res.status(204).end()
}
