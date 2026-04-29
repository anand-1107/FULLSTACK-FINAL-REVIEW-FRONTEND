import axiosClient from './axiosClient'

export const login = async (username, password) => {
  const response = await axiosClient.post('/auth/login', { login: username, password })
  return response.data
}

export const adminLogin = async (username, password) => {
  const response = await axiosClient.post('/auth/admin-login', { login: username, password })
  return response.data
}
