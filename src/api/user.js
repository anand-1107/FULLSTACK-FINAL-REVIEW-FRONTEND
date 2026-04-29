import axiosClient from './axiosClient'

export const registerUser = async (userData) => {
  const response = await axiosClient.post('/user/signup', userData)
  return response.data
}

export const updateUserProfile = async (userData) => {
  const response = await axiosClient.put('/user/updateuserprofile', userData)
  return response.data
}

export const getUserByUsername = async (username) => {
  const response = await axiosClient.get(`/user/getbyusername/${username}`)
  return response.data
}
