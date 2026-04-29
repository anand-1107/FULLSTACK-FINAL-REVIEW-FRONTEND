import axiosClient from './axiosClient'

export const getAllUsers = async () => {
  const response = await axiosClient.get('/admin/viewallusers')
  return response.data
}

export const deleteUser = async (id) => {
  const response = await axiosClient.delete(`/admin/deleteuserbyid/${id}`)
  return response.data
}

export const getAllCertificates = async () => {
  const response = await axiosClient.get('/admin/viewallcertificates')
  return response.data
}

export const getExpiringCertificates = async (date) => {
  const response = await axiosClient.get(`/admin/expiringcertificates/${date}`)
  return response.data
}

export const sendEmail = async (emailDto) => {
  const response = await axiosClient.post('/admin/sendemail', emailDto)
  return response.data
}
