'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Bem-vindo, <span className="text-green-500">{user?.email || 'Atleta'}</span>
        </h1>
        <p className="text-gray-400 mt-1">Seu resumo de hoje</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Treino de Hoje</p>
          <p className="text-2xl font-bold text-white mt-1">Peito & Tríceps</p>
          <p className="text-green-500 text-sm mt-2">5 exercícios</p>
        </div>
        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Calorias Hoje</p>
          <p className="text-2xl font-bold text-white mt-1">1.850 kcal</p>
          <p className="text-yellow-500 text-sm mt-2">Meta: 2.200 kcal</p>
        </div>
        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Água</p>
          <p className="text-2xl font-bold text-white mt-1">1.200 ml</p>
          <p className="text-blue-400 text-sm mt-2">Meta: 2.000 ml</p>
        </div>
        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Sequência</p>
          <p className="text-2xl font-bold text-white mt-1">7 dias</p>
          <p className="text-green-500 text-sm mt-2">Continue assim!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Próximo Treino</h2>
          <div className="space-y-3">
            {['Supino Reto 4x12', 'Supino Inclinado 3x10', 'Crucifixo 3x12', 'Tríceps Corda 3x15', 'Tríceps Testa 3x12'].map((exercise, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <span className="text-gray-300">{exercise}</span>
                <span className="text-green-500 text-sm">#{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Plano Alimentar</h2>
          <div className="space-y-3">
            {[
              { meal: 'Café da manhã', cal: '450 kcal' },
              { meal: 'Lanche da manhã', cal: '200 kcal' },
              { meal: 'Almoço', cal: '650 kcal' },
              { meal: 'Lanche da tarde', cal: '300 kcal' },
              { meal: 'Jantar', cal: '450 kcal' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <span className="text-gray-300">{item.meal}</span>
                <span className="text-green-500 text-sm">{item.cal}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
