import { api } from '../../../api.js'

export const loginRequest = (email, password) => api.post('/auth/login', { email, password })
