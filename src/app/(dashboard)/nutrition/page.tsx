'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { nutritionAPI } from '../../../lib/api'
import toast from 'react-hot-toast'

export default function NutritionPage() {
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
      const r = await nutritionAPI.getActive()
      setActivePlan(r.data)
    } catch { setActivePlan(null) }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    setError('')
    try {
      const res = await nutritionAPI.generate()
      setActivePlan(res.data)
      toast.success('Plano alimentar gerado!')
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Erro ao gerar plano'
      setError(msg)
      toast.error(msg)
    }
    setGenerating(false)
  }

  const handleDelete = async () => {
    if (!confirm('Excluir este plano alimentar e gerar um novo?')) return
    setDeleting(true)
    try {
      await nutritionAPI.delete()
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
        <h1 className="text-2xl font-bold text-white">Alimentação</h1>
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
          <div className="text-5xl mb-4">🍽️</div>
          <p className="text-gray-400 mb-4">Você ainda não tem um plano alimentar</p>
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
              Meta: <span className="text-green-500 font-semibold">{activePlan.daily_calorie_target} kcal/dia</span>
            </p>
            {activePlan.macros_target && (
              <div className="flex gap-4 mt-2 text-sm">
                <span className="text-gray-300">🥩 Proteína: {activePlan.macros_target.protein_g}g</span>
                <span className="text-gray-300">🍚 Carboidrato: {activePlan.macros_target.carbs_g}g</span>
                <span className="text-gray-300">🥑 Gordura: {activePlan.macros_target.fat_g}g</span>
              </div>
            )}
          </div>

          {(activePlan.meals || []).map((meal: any, i: number) => (
            <div key={meal.id || i} className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">
                📅 {meal.day_of_week} — {meal.meal_type}
              </h2>
              
              {meal.meal_items && meal.meal_items.length > 0 ? (
                <div className="space-y-2">
                  {meal.meal_items.map((item: any, j: number) => (
                    <div key={item.id || j} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                      <span className="text-white">{item.food?.name || `Alimento ${j + 1}`}</span>
                      <span className="text-green-500 text-sm">{item.quantity_g}g</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Sem itens nesta refeição</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
