import { pool } from '../db.js'
import { aCoche, SELECT_COCHE } from '../helpers/coche.helper.js'
import { marcaSchema } from '../validators/marca.validator.js'

export const getMarcas = async (req, res) => {
    const [filas] = await pool.query(`
        SELECT m.id, m.nombre, COUNT(c.id) AS totalCoches
        FROM marcas m
        LEFT JOIN coches c ON c.marca_id = m.id
        GROUP BY m.id, m.nombre
        ORDER BY m.nombre
    `)

    res.json(filas.map((fila) => ({ ...fila, totalCoches: Number(fila.totalCoches) })))
}

export const getMarca = async (req, res) => {
    const [marcas] = await pool.query('SELECT id, nombre FROM marcas WHERE id = ?', [req.id])

    if (!marcas[0]) return res.status(404).json({ error: 'Marca no encontrada' })

    const [coches] = await pool.query(
        `${SELECT_COCHE} WHERE c.marca_id = ? ORDER BY c.id DESC`,
        [req.id]
    )

    res.json({ ...marcas[0], coches: coches.map(aCoche) })
}

export const createMarca = async (req, res) => {
    const { nombre } = marcaSchema.parse(req.body)

    const [resultado] = await pool.query('INSERT INTO marcas (nombre) VALUES (?)', [nombre])

    res.status(201).json({ id: resultado.insertId, nombre })
}

export const updateMarca = async (req, res) => {
    const { nombre } = marcaSchema.parse(req.body)

    const [existe] = await pool.query('SELECT id FROM marcas WHERE id = ?', [req.id])
    if (!existe[0]) return res.status(404).json({ error: 'Marca no encontrada' })

    await pool.query('UPDATE marcas SET nombre = ? WHERE id = ?', [nombre, req.id])

    res.json({ id: req.id, nombre })
}

export const deleteMarca = async (req, res) => {
    const [resultado] = await pool.query('DELETE FROM marcas WHERE id = ?', [req.id])

    if (!resultado.affectedRows) {
        return res.status(404).json({ error: 'Marca no encontrada' })
    }

    res.status(204).end()
}
