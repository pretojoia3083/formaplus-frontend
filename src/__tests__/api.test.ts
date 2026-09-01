import { authAPI, workoutsAPI, nutritionAPI, progressAPI } from '@/lib/api'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Auth API', () => {
    it('should register user', async () => {
      const mockData = { email: 'test@email.com', password: 'password123' }
      const mockResponse = { data: { id: 1, email: 'test@email.com' } }
      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await authAPI.register(mockData)
      expect(mockedAxios.post).toHaveBeenCalledWith('/auth/register', mockData)
      expect(result).toEqual(mockResponse)
    })

    it('should login user', async () => {
      const mockData = { email: 'test@email.com', password: 'password123' }
      const mockResponse = { data: { access_token: 'token123' } }
      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await authAPI.login(mockData)
      expect(mockedAxios.post).toHaveBeenCalledWith('/auth/login/json', mockData)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('Workouts API', () => {
    it('should generate workout plan', async () => {
      const mockResponse = { data: { id: 1, name: 'Plano de Treino' } }
      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await workoutsAPI.generate()
      expect(mockedAxios.post).toHaveBeenCalledWith('/workouts/generate')
      expect(result).toEqual(mockResponse)
    })

    it('should get today workout', async () => {
      const mockResponse = { data: { id: 1, focus: 'Upper Body' } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await workoutsAPI.getToday()
      expect(mockedAxios.get).toHaveBeenCalledWith('/workouts/today')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('Nutrition API', () => {
    it('should log meal', async () => {
      const mockData = {
        meal_type: 'lunch',
        freeform_description: 'Arroz e frango',
        estimated_calories: 450
      }
      const mockResponse = { data: { id: 1, ...mockData } }
      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await nutritionAPI.log(mockData)
      expect(mockedAxios.post).toHaveBeenCalledWith('/nutrition/log', mockData)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('Progress API', () => {
    it('should log weight', async () => {
      const mockData = { weight_kg: 75.5 }
      const mockResponse = { data: { id: 1, ...mockData } }
      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await progressAPI.logWeight(mockData)
      expect(mockedAxios.post).toHaveBeenCalledWith('/progress/weight', mockData)
      expect(result).toEqual(mockResponse)
    })

    it('should get dashboard', async () => {
      const mockResponse = { data: { greeting: 'Bom dia', streak: 5 } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await progressAPI.getDashboard()
      expect(mockedAxios.get).toHaveBeenCalledWith('/dashboard')
      expect(result).toEqual(mockResponse)
    })
  })
})
