export const validId = (req, res, next) => {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ error: 'ID inválido' })
    }

    req.id = id
    next()
}
