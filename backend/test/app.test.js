// La config exige JWT_SECRET antes de importar la app
process.env.JWT_SECRET ||= 'secreto-de-test'

import assert from 'node:assert/strict'
import { after, before, describe, test } from 'node:test'

const { app } = await import('../app.js')

let server
let base

before(async () => {
    await new Promise((resolve) => {
        server = app.listen(0, resolve)
    })
    base = `http://127.0.0.1:${server.address().port}`
})

after(() => server.close())

const pedir = (ruta, opciones = {}) => fetch(`${base}${ruta}`, opciones)

const json = (ruta, body, token) =>
    pedir(ruta, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(body)
    })

describe('rutas sin base de datos', () => {
    test('GET /api/health responde ok', async () => {
        const res = await pedir('/api/health')

        assert.equal(res.status, 200)
        assert.deepEqual(await res.json(), { ok: true })
    })

    test('una ruta inexistente devuelve 404 en JSON', async () => {
        const res = await pedir('/api/no-existe')

        assert.equal(res.status, 404)
        assert.match((await res.json()).error, /no existe/)
    })

    test('POST /api/auth/login sin credenciales devuelve 400 con detalles', async () => {
        const res = await json('/api/auth/login', {})

        assert.equal(res.status, 400)
        const body = await res.json()
        assert.equal(body.error, 'Datos inválidos')
        assert.deepEqual(
            body.detalles.map((detalle) => detalle.campo),
            ['email', 'password']
        )
    })

    test('GET /api/coches?page=0 devuelve 400 (validación antes de la query)', async () => {
        const res = await pedir('/api/coches?page=0')

        assert.equal(res.status, 400)
        assert.equal((await res.json()).detalles[0].campo, 'page')
    })

    test('GET /api/coches/abc devuelve 400 (id inválido)', async () => {
        const res = await pedir('/api/coches/abc')

        assert.equal(res.status, 400)
        assert.equal((await res.json()).error, 'ID inválido')
    })

    test('POST /api/coches sin token devuelve 401', async () => {
        const res = await json('/api/coches', { marcaId: 1 })

        assert.equal(res.status, 401)
        assert.equal((await res.json()).error, 'Token requerido')
    })

    test('POST /api/uploads sin token devuelve 401', async () => {
        const res = await pedir('/api/uploads', { method: 'POST' })

        assert.equal(res.status, 401)
    })

    test('un token inválido no da acceso', async () => {
        const res = await json('/api/coches', { marcaId: 1 }, 'token-falso')

        assert.equal(res.status, 401)
    })
})
