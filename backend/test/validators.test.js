import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import {
    cocheQuerySchema,
    cocheSchema,
    cocheUpdateSchema
} from '../validators/coche.validator.js'
import { loginSchema } from '../validators/auth.validator.js'
import { marcaSchema } from '../validators/marca.validator.js'

const COCHE_VALIDO = {
    marcaId: 1,
    modelo: '488 GTB',
    anio: 2021,
    precio: 320000,
    color: 'Rojo',
    puertas: 2,
    combustible: 'gasolina'
}

const camposInvalidos = (schema, datos) => {
    const resultado = schema.safeParse(datos)
    assert.equal(resultado.success, false)
    return resultado.error.issues.map((issue) => issue.path.join('.'))
}

describe('cocheSchema', () => {
    test('acepta un coche válido', () => {
        assert.equal(cocheSchema.safeParse(COCHE_VALIDO).success, true)
    })

    test('convierte números enviados como texto', () => {
        const { anio, precio, puertas } = cocheSchema.parse({
            ...COCHE_VALIDO,
            anio: '2021',
            precio: '320000',
            puertas: '2'
        })

        assert.equal(anio, 2021)
        assert.equal(precio, 320000)
        assert.equal(puertas, 2)
    })

    test('rechaza precio 0 y precio negativo', () => {
        assert.deepEqual(camposInvalidos(cocheSchema, { ...COCHE_VALIDO, precio: 0 }), ['precio'])
        assert.deepEqual(camposInvalidos(cocheSchema, { ...COCHE_VALIDO, precio: -1 }), ['precio'])
    })

    test('rechaza año fuera de rango', () => {
        assert.deepEqual(camposInvalidos(cocheSchema, { ...COCHE_VALIDO, anio: 1899 }), ['anio'])
        const futuro = new Date().getFullYear() + 2
        assert.deepEqual(camposInvalidos(cocheSchema, { ...COCHE_VALIDO, anio: futuro }), ['anio'])
    })

    test('rechaza combustible desconocido', () => {
        assert.deepEqual(
            camposInvalidos(cocheSchema, { ...COCHE_VALIDO, combustible: 'nuclear' }),
            ['combustible']
        )
    })

    test('rechaza puertas fuera de 2-6', () => {
        assert.deepEqual(camposInvalidos(cocheSchema, { ...COCHE_VALIDO, puertas: 1 }), ['puertas'])
        assert.deepEqual(camposInvalidos(cocheSchema, { ...COCHE_VALIDO, puertas: 7 }), ['puertas'])
    })

    test('rechaza modelo vacío', () => {
        assert.deepEqual(camposInvalidos(cocheSchema, { ...COCHE_VALIDO, modelo: '   ' }), ['modelo'])
    })
})

describe('cocheUpdateSchema', () => {
    test('acepta un body vacío (PUT parcial)', () => {
        assert.deepEqual(cocheUpdateSchema.parse({}), {})
    })

    test('sigue validando los campos enviados', () => {
        assert.deepEqual(camposInvalidos(cocheUpdateSchema, { precio: -5 }), ['precio'])
    })
})

describe('cocheQuerySchema', () => {
    test('aplica valores por defecto', () => {
        const query = cocheQuerySchema.parse({})

        assert.deepEqual(query, {
            page: 1,
            limit: 10,
            orden: 'recientes'
        })
    })

    test('convierte page y limit a número', () => {
        const query = cocheQuerySchema.parse({ page: '3', limit: '25' })

        assert.equal(query.page, 3)
        assert.equal(query.limit, 25)
    })

    test('rechaza page 0 y limit mayor a 100', () => {
        assert.deepEqual(camposInvalidos(cocheQuerySchema, { page: 0 }), ['page'])
        assert.deepEqual(camposInvalidos(cocheQuerySchema, { limit: 101 }), ['limit'])
    })

    test('rechaza un orden no permitido', () => {
        assert.deepEqual(camposInvalidos(cocheQuerySchema, { orden: 'id; DROP TABLE coches' }), [
            'orden'
        ])
    })
})

describe('loginSchema', () => {
    test('normaliza el email', () => {
        const { email } = loginSchema.parse({ email: '  admin@prueba.com ', password: 'x' })

        assert.equal(email, 'admin@prueba.com')
    })

    test('rechaza email inválido y password vacía', () => {
        assert.deepEqual(camposInvalidos(loginSchema, { email: 'no-es-email', password: 'x' }), [
            'email'
        ])
        assert.deepEqual(camposInvalidos(loginSchema, { email: 'a@b.com', password: '' }), [
            'password'
        ])
    })
})

describe('marcaSchema', () => {
    test('acepta un nombre normal y recorta espacios', () => {
        assert.deepEqual(marcaSchema.parse({ nombre: '  Ferrari  ' }), { nombre: 'Ferrari' })
    })

    test('rechaza vacío y más de 50 caracteres', () => {
        assert.deepEqual(camposInvalidos(marcaSchema, { nombre: '' }), ['nombre'])
        assert.deepEqual(camposInvalidos(marcaSchema, { nombre: 'a'.repeat(51) }), ['nombre'])
    })
})
