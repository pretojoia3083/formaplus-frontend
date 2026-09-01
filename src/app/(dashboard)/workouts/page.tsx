'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { workoutsAPI } from '../../../lib/api'

export default function WorkoutsPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [activePlan, setActivePlan] = useState<any>(null)
  const [todayWorkout, setTodayWorkout] = useState<any>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login')
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      workoutsAPI.getActive().then(r => setActivePlan(r.data)).catch(() => {})
      workoutsAPI.getToday().then(r => setTodayWorkout(r.data)).catch(() => {})
    }
  }, [isAuthenticated])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await workoutsAPI.generate()
      setActivePlan(res.data)
    } catch {}
    setGenerating(false)
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" /></div>

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Treinos</h1>

      {!activePlan ? (
        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-400 mb-4">Você ainda não tem um plano de treino</p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-6 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50"
          >
            {generating ? 'Gerando plano...' : 'Gerar Plano com IA'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-2">Plano Ativo</h2>
            <p className="text-gray-400">Versão {activePlan.version || 1} — Status: <span className="text-green-500">{activePlan.status || 'active'}</span></p>
          </div>

          {todayWorkout && (
            <div className="bg-[#171B1E] border border-green-500/30 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-green-500 mb-4">Treino de Hoje — {todayWorkout.focus || 'Treino Geral'}</h2>
              <div className="space-y-3">
                {(todayWorkout.session_exercises || []).map((se: any, i: number) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                    <div>
                      <p className="text-white font-medium">{se.exercise?.name || `Exercício ${i + 1}`}</p>
                      <p className="text-gray-400 text-sm">{se.sets}x{se.reps} — Descanso: {se.rest_seconds}s</p>
                    </div>
                    <button className="px-3 py-1 bg-green-500/10 text-green-500 text-sm rounded-lg hover:bg-green-500/20 transition-colors">
                      Log
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
