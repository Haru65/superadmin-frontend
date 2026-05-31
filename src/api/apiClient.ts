import axios, { type AxiosError } from 'axios'
import { clearToken, getToken } from '@/utils/auth'

export const SUPERADMIN_API_URL = String(import.meta.env.VITE_SUPERADMIN_API_URL || '').replace(/\/$/, '')

export const createApiClient = (baseURL: string) => {
  const client = axios.create({ baseURL, timeout: 12000 })
  client.interceptors.request.use((config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        clearToken()
        window.dispatchEvent(new Event('logdine:unauthorized'))
      }
      return Promise.reject(error)
    },
  )
  return client
}

export const gatewayApi = createApiClient(SUPERADMIN_API_URL)

export const errorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as { error?: string; message?: string } | undefined
    return payload?.error || payload?.message || error.message
  }
  return error instanceof Error ? error.message : 'Unexpected API error'
}
