import { useAuth } from '@/state/auth.store'
import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.VITE_API_BASE_URL ?? 'http://localhost:4000',
})

api.interceptors.request.use((config) => {
  const token = useAuth.getState().token // <-- 호출 시점에 최신 토큰
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})