import axios from 'axios'
import { getToken } from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const adminAPI = {
  getStats: () => axios.get(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${getToken()}` } }),
  
  getTrainers: (status?: string) => axios.get(`${API_URL}/admin/trainers`, { 
    params: status ? { status } : {},
    headers: { Authorization: `Bearer ${getToken()}` } 
  }),
  
  approveTrainer: (id: number) => axios.post(`${API_URL}/admin/trainers/${id}/approve`, null, { 
    headers: { Authorization: `Bearer ${getToken()}` } 
  }),
  
  rejectTrainer: (id: number) => axios.post(`${API_URL}/admin/trainers/${id}/reject`, null, { 
    headers: { Authorization: `Bearer ${getToken()}` } 
  }),
}
