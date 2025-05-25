import { env } from '@/lib/env'
import axios from 'axios'

export const api = axios.create({
  baseURL: env.REACT_APP_API_URL,
  withCredentials: true, // Importante para CORS com credenciais
  headers: {
    'Accept': 'application/json',
  },
  maxContentLength: Infinity,  // Para uploads grandes
  maxBodyLength: Infinity,     // Para uploads grandes
})
