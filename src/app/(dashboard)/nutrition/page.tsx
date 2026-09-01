'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { nutritionAPI } from '../../../lib/api'

export default function NutritionPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [activePlan, setActivePlan] = useState<any>(null)
  const [todayMeals, setTodayMeals] = useState<any[]>([])
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login')
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      nutritionAPI.getActive().then(r => setActivePlan(r.data)).catch(() => {})
      nutritionAPI.getToday().then(r => setTodayMeals(r.data || [])).catch(() => {})
    }
  }, [isAuthenticated])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await nutritionAPI.generate()
      setActivePlan(res.data)
    } catch {}
    setGenerating(false)
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" /></div>

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Alimentação</h1>

      {!activePlan ? (
        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-400 mb-4">Você ainda não tem um plano alimentar</p>
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
            <p className="text-gray-400">Meta: <span className="text-green-500">{activePlan.daily_calorie_target} kcal/dia</span></p>
            {activePlan.macros_target && (
              <div className="flex gap-4 mt-3 text-sm">
                <span className="text-gray-300">P: {activePlan.macros_target.protein_g}g</span>
                <span className="text-gray-300">C: {activePlan.macros_target.carbs_g}g</span>
                <span className="text-gray-300">G: {activePlan.macros_target.fat_g}g</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {todayMeals.map((meal: any, i: number) => (
              <div key={i} className="bg-[#171B1E] border border-gray-800 rounded-xl p-5">
                <h3 className="text-white font-semibold capitalize">{meal.meal_type}</h3>
                <div className="mt-3 space-y-2">
                  {(meal.meal_items || []).map((item: any, j: number) => (
                    <div key={j} className="flex justify-between text-sm text-gray-300 py-1 border-b border-gray-800/50 last:border-0">
                      <span>Alimento #{j + 1}</span>
                      <span>{item.quantity_g}g</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {todayMeals.length === 0 && (
              <p className="text-gray-400 text-center py-4">Nenhuma refeição programada para hoje</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
