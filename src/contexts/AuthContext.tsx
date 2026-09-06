'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '../lib/api'
import { getToken, setToken, removeToken, setUser, getUser, isAuthenticated } from '../lib/auth'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: any | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const savedUser = getUser()
    if (savedUser && isAuthenticated()) {
      setUserState(savedUser)
      authAPI.getMe().then(r => {
        setUser(r.data)
        setUserState(r.data)
      }).catch(() => {})
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password })
      const { access_token, user: userData } = response.data
      
      setToken(access_token)
      const userInfo = userData || { email, id: 1 }
      setUser(userInfo)
      setUserState(userInfo)

      try {
        const me = await authAPI.getMe()
        setUser(me.data)
        setUserState(me.data)
        if (!me.data.onboarding_complete) {
          router.push('/onboarding')
          toast.success('Vamos configurar seu perfil!')
          return
        }
      } catch {}
      
      toast.success('Login realizado com sucesso!')
      router.push('/dashboard')
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Erro ao fazer login'
      toast.error(message)
      throw error
    }
  }

  const register = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      await authAPI.register({ email, password, first_name: firstName, last_name: lastName })
      toast.success('Cadastro realizado com sucesso! Faça login.')
      router.push('/login')
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Erro ao cadastrar'
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    removeToken()
    setUserState(null)
    toast.success('Deslogado com sucesso')
    router.push('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user && isAuthenticated(),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
