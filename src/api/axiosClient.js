import axios from 'axios'

const axiosClient = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:2006' })

axiosClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  if (token && token !== 'demo-token') {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Auto-refresh token on 401 (token expired)
    if (error?.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
      originalRequest._retry = true
      isRefreshing = true

      try {
        const role = localStorage.getItem('role')
        const endpoint = role === 'admin' ? '/auth/admin-login' : '/auth/login'
        const credentials = role === 'admin'
          ? { login: 'admin', password: 'admin' }
          : { login: 'user', password: 'user' }

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:2006'}${endpoint}`,
          credentials
        )
        const newToken = res.data.token
        sessionStorage.setItem('token', newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        isRefreshing = false
        return axiosClient(originalRequest)
      } catch {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default axiosClient
