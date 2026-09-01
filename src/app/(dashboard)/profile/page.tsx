'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { subscriptionsAPI } from '../../../lib/api'

export default function ProfilePage() {
  const { user, isAuthenticated, loading, logout } = useAuth()
  const router = useRouter()
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login')
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      subscriptionsAPI.getMySubscription().then(r => setSubscription(r.data)).catch(() => {})
    }
  }, [isAuthenticated])

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" /></div>

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>

      <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500/30 flex items-center justify-center text-green-500 text-2xl font-bold">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-white font-semibold text-lg">{user?.email || 'Usuário'}</p>
            <p className="text-gray-400 text-sm">ID: {user?.id || '-'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-800">
            <span className="text-gray-400">Plano Atual</span>
            <span className="text-green-500 font-semibold uppercase">{subscription?.plan || 'Free'}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-800">
            <span className="text-gray-400">Status</span>
            <span className={`font-semibold ${subscription?.status === 'active' ? 'text-green-500' : 'text-yellow-500'}`}>
              {subscription?.status || 'active'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Planos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Free', price: 'Grátis', features: ['1 treino/semana', 'Coach básico', 'Progresso básico'] },
            { name: 'Pro', price: 'R$ 29,90/mês', features: ['Treinos ilimitados', 'Nutrição por IA', 'Coach avançado', 'Substituições'] },
            { name: 'Premium', price: 'R$ 49,90/mês', features: ['Tudo do Pro', 'Análise de fotos', 'Planos profissionais', 'Suporte prioritário'] },
          ].map((plan) => (
            <div key={plan.name} className={`border rounded-xl p-5 ${plan.name.toLowerCase() === (subscription?.plan || 'free') ? 'border-green-500 bg-green-500/5' : 'border-gray-800 bg-[#0B0D0F]'}`}>
              <h3 className="text-white font-bold text-lg">{plan.name}</h3>
              <p className="text-green-500 font-semibold mt-1">{plan.price}</p>
              <ul className="mt-3 space-y-2">
                {plan.features.map((f, i) => (
                  <li key={i} className="text-gray-400 text-sm">✓ {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full py-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-colors font-semibold"
      >
        Sair da Conta
      </button>
    </div>
  )
}
