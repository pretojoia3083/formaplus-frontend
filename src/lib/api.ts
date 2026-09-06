import axios from 'axios'
import { getToken, setToken, removeToken } from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data: { email: string; password: string; first_name?: string; last_name?: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login/json', data),
  
  getMe: () =>
    api.get('/auth/me'),
  
  saveOnboarding: (data: any) =>
    api.post('/auth/onboarding', data),
  
  deleteAccount: () =>
    api.delete('/auth/delete-account'),
  
  refresh: () =>
    api.post('/auth/refresh'),
}

export const workoutsAPI = {
  generate: () => api.post('/workouts/generate'),
  
  getActive: () => api.get('/workouts/active'),
  
  getToday: () => api.get('/workouts/today'),
  
  getHistory: (params?: { limit?: number; offset?: number }) =>
    api.get('/workouts/history', { params }),
  
  delete: () => api.delete('/workouts/delete'),
  
  start: (sessionId: number) =>
    api.post(`/workouts/sessions/${sessionId}/start`),
  
  finish: (sessionId: number) =>
    api.post(`/workouts/sessions/${sessionId}/finish`),
  
  logExercise: (sessionExerciseId: number, data: {
    weight_kg?: number
    reps_done?: number
    difficulty_feedback?: string
  }) => api.post(`/workouts/exercises/${sessionExerciseId}/log`, data),
  
  adapt: (sessionId: number, data: { available_minutes: number }) =>
    api.post(`/workouts/sessions/${sessionId}/adapt`, data),
  
  substitute: (sessionExerciseId: number) =>
    api.post(`/workouts/exercises/${sessionExerciseId}/substitute`),
}

export const nutritionAPI = {
  generate: () => api.post('/nutrition/generate'),
  
  getActive: () => api.get('/nutrition/active'),
  
  getToday: () => api.get('/nutrition/today'),
  
  log: (data: {
    meal_id?: number
    meal_type?: string
    freeform_description?: string
    photo_url?: string
    estimated_calories?: number
    estimated_macros?: { protein_g: number; carbs_g: number; fat_g: number }
    confirmed_by_user?: boolean
  }) => api.post('/nutrition/log', data),
  
  estimateMeal: (description: string) =>
    api.post(`/nutrition/estimate-meal?description=${encodeURIComponent(description)}`),
  
  getDailyProgress: () => api.get('/nutrition/daily-progress'),
  
  getHistory: (params?: { limit?: number; offset?: number }) =>
    api.get('/nutrition/history', { params }),
  
  delete: () => api.delete('/nutrition/delete'),
}

export const progressAPI = {
  getDashboard: () => api.get('/dashboard'),
  
  getSummary: () => api.get('/progress/summary'),
  
  logWeight: (data: { weight_kg: number }) =>
    api.post('/progress/weight', data),
  
  getWeightHistory: (days?: number) =>
    api.get('/progress/weight', { params: { days } }),
  
  logMeasurements: (data: {
    waist_cm?: number
    hip_cm?: number
    arm_cm?: number
  }) => api.post('/progress/measurements', data),
  
  getMeasurementsHistory: (days?: number) =>
    api.get('/progress/measurements', { params: { days } }),
  
  logWater: (data: { amount_ml: number }) =>
    api.post('/progress/water', data),
  
  getWaterToday: () => api.get('/progress/water/today'),
  
  getWaterHistory: (days?: number) =>
    api.get('/progress/water/history', { params: { days } }),
  
  logSteps: (data: { steps: number; date?: string }) =>
    api.post('/progress/steps', data),
  
  getStepsToday: () => api.get('/progress/steps/today'),
  
  getStreak: () => api.get('/progress/streak'),
}

export const coachAPI = {
  sendMessage: (data: {
    user_id: number
    user_message: string
    conversation_id?: number
  }) => api.post('/coach/message', data),
  
  getConversations: () => api.get('/coach/conversations'),
  
  getConversationMessages: (conversationId: number) =>
    api.get(`/coach/conversations/${conversationId}`),
}

export const subscriptionsAPI = {
  getPlans: () => api.get('/plans'),
  
  getPlan: (planType: string) => api.get(`/plans/${planType}`),
  
  getMySubscription: () => api.get('/subscription'),
  
  create: (planType: string, paymentMethodId?: string) =>
    api.post(`/subscription/create?plan_type=${planType}&payment_method_id=${paymentMethodId || ''}`),
  
  cancel: () => api.post('/subscription/cancel'),
  
  update: (newPlan: string) =>
    api.post(`/subscription/update?new_plan=${newPlan}`),
  
  getPayments: (params?: { limit?: number; offset?: number }) =>
    api.get('/payments', { params }),
}
