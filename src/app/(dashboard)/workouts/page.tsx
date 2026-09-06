'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { workoutsAPI } from '../../../lib/api'
import toast from 'react-hot-toast'

export default function WorkoutsPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [activePlan, setActivePlan] = useState<any>(null)
  const [generating, setGenerating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login')
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) loadPlan()
  }, [isAuthenticated])

  const loadPlan = async () => {
    try {
      const r = await workoutsAPI.getActive()
      setActivePlan(r.data)
    } catch { setActivePlan(null) }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    setError('')
    try {
      const res = await workoutsAPI.generate()
      setActivePlan(res.data)
      toast.success('Plano gerado com sucesso!')
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Erro ao gerar treino'
      setError(msg)
      toast.error(msg)
    }
    setGenerating(false)
  }

  const handleDelete = async () => {
    if (!confirm('Excluir este plano e gerar um novo?')) return
    setDeleting(true)
    try {
      await workoutsAPI.delete()
      setActivePlan(null)
      toast.success('Plano excluído!')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Erro ao excluir')
    }
    setDeleting(false)
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" /></div>

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Treinos</h1>
        {activePlan && (
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 text-sm"
            >
              {deleting ? 'Excluindo...' : '🗑️ Excluir Plano'}
            </button>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-4 py-2 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50 text-sm"
            >
              {generating ? 'Gerando...' : '🔄 Gerar Novo Plano'}
            </button>
          </div>
        )}
      </div>

      {!activePlan ? (
        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-8 text-center">
          <div className="text-5xl mb-4">🏋️</div>
          <p className="text-gray-400 mb-4">Você ainda não tem um plano de treino</p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-6 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50"
          >
            {generating ? 'Gerando plano com IA...' : '🚀 Gerar Plano com IA'}
          </button>
          {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">
              Plano versão {activePlan.version || 1} — 
              <span className="text-green-500 ml-1">{activePlan.sessions?.length || 0} treinos na semana</span>
            </p>
          </div>

          {(activePlan.sessions || []).map((session: any, i: number) => (
            <div key={session.id || i} className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-white">
                  📅 {session.day_of_week} — {session.focus}
                </h2>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  session.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                  session.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-gray-700 text-gray-400'
                }`}>
                  {session.status === 'completed' ? '✅ Feito' : session.status === 'in_progress' ? '⏳ Andamento' : '📋 Pendente'}
                </span>
              </div>
              
              {session.session_exercises && session.session_exercises.length > 0 ? (
                <div className="space-y-2">
                  {session.session_exercises.map((se: any, j: number) => (
                    <div key={se.id || j} className="py-4 border-b border-gray-800 last:border-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-green-500 text-sm font-mono bg-green-500/10 px-2 py-0.5 rounded">#{j + 1}</span>
                            <span className="text-white font-semibold">{se.exercise?.name || `Exercício ${j + 1}`}</span>
                          </div>
                          <p className="text-gray-400 text-sm ml-10">{se.exercise?.instructions || ''}</p>
                          <div className="flex items-center gap-4 mt-2 ml-10">
                            <span className="text-gray-300 text-sm">🔄 {se.sets} séries x {se.reps} reps</span>
                            <span className="text-gray-500 text-sm">⏱️ descanso {se.rest_seconds}s</span>
                          </div>
                          <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(se.exercise?.name || 'exercicio') + '+como+fazer+tutorial'}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-2 ml-10 px-3 py-1 bg-red-500/10 text-red-400 text-xs rounded-lg hover:bg-red-500/20 transition-colors"
                          >
                            ▶ Ver vídeo no YouTube
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Sem exercícios neste treino</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
