import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []
let hasRedirected = false

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb)
}

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

const redirectToLogin = () => {
  if (!hasRedirected) {
    hasRedirected = true
    window.location.href = '/login'
  }
}

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/refresh')) {
        // Refresh failing usually means cookies are missing/expired.
        // Don't hard-redirect blindly here; let route guards decide.
        return Promise.reject(error)
      }

      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(api(originalRequest))
          })
        })
      }

      isRefreshing = true
      try {
        await api.post('/auth/refresh')
        onRefreshed('')
        return api(originalRequest)
      } catch (err) {
        redirectToLogin()
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// Reset redirect flag on successful auth
export function resetAuthRedirect() {
  hasRedirected = false
}

export default api
