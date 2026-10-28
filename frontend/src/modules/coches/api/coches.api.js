import { api } from '../../../api.js'

export const getCoches = (filtros = '') => {
    const query = String(filtros)
    return api.get(query ? `/coches?${query}` : '/coches')
}

export const getCoche = (id) => api.get(`/coches/${id}`)

export const getMarcas = () => api.get('/marcas')

export const crearCoche = (datos) => api.post('/coches', datos)

export const actualizarCoche = (id, datos) => api.put(`/coches/${id}`, datos)

export const eliminarCoche = (id) => api.delete(`/coches/${id}`)

export const subirImagen = (archivo) => {
    const datos = new FormData()
    datos.append('imagen', archivo)
    return api.post('/uploads', datos)
}
