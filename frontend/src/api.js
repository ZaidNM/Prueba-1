const BASE = import.meta.env.VITE_API_URL || '/api'

export class ApiError extends Error {
    constructor(mensaje, status, detalles) {
        super(mensaje)
        this.status = status
        this.detalles = detalles
    }
}

async function request(ruta, { method = 'GET', body } = {}) {
    const token = localStorage.getItem('token')
    const esFormData = body instanceof FormData

    const res = await fetch(`${BASE}${ruta}`, {
        method,
        headers: {
            ...(body && !esFormData && { 'Content-Type': 'application/json' }),
            ...(token && { Authorization: `Bearer ${token}` })
        },
        body: body ? (esFormData ? body : JSON.stringify(body)) : undefined
    })

    if (res.status === 204) return null

    const datos = await res.json().catch(() => ({}))

    if (!res.ok) {
        throw new ApiError(datos.error || 'No se pudo conectar con la API', res.status, datos.detalles)
    }

    return datos
}

export const api = {
    get: (ruta) => request(ruta),
    post: (ruta, body) => request(ruta, { method: 'POST', body }),
    put: (ruta, body) => request(ruta, { method: 'PUT', body }),
    delete: (ruta) => request(ruta, { method: 'DELETE' })
}
