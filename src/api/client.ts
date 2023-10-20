import axios from 'axios'
import Cookies from 'js-cookie'

import { isServer } from '@/utils'

const api = axios.create({ baseURL: 'http://localhost:8080/api' })

// @ts-ignore
api.interceptors.request.use((config) => {
  if (!isServer()) {
    const token = Cookies.get('token')

    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : ''
      }
    }
  }

  return config
})

export { api }
