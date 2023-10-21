import axios from 'axios'
import Cookies from 'js-cookie'

import { isServer } from '@/utils'

const api = axios.create()

// @ts-ignore
api.interceptors.request.use((config) => {
  if (!isServer()) {
    const token = Cookies.get('token')

    return {
      ...config,
      baseURL: '/api',
      headers: {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : ''
      }
    }
  }

  return { ...config, baseURL: process.env.API_URL + '/api' }
})

export { api }
