'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { workoutsAPI, nutritionAPI, progressAPI, trainerAPI } from '../../../lib/api'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [todayWorkout, setTodayWorkout] = useState<any>(null)
  const [todayMeals, setTodayMeals] = useState<any[]>([])
  const [waterToday, setWaterToday] = useState<any>(null)
  const [generatingWorkout, setGeneratingWorkout] = useState(false)
  const [generatingNutrition, setGeneratingNutrition] = useState(false)
  const [myTrainer, setMyTrainer] = useState<any>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      workoutsAPI.getToday().then(r => setTodayWorkout(r.data)).catch(() => {})
      nutritionAPI.getToday().then(r => setTodayMeals(r.data || [])).catch(() => {})
      progressAPI.getWaterToday().then(r => setWaterToday(r.data)).catch(() => {})
      trainerAPI.getMyTrainer().then(r => setMyTrainer(r.data)).catch(() => {})
    }
  }, [isAuthenticated])

  const handleGenerateWorkout = async () => {
    setGeneratingWorkout(true)
    try {
      await workoutsAPI.generate()
      const r = await workoutsAPI.getToday()
      setTodayWorkout(r.data)
    } catch {}
    setGeneratingWorkout(false)
  }

  const handleGenerateNutrition = async () => {
    setGeneratingNutrition(true)
    try {
      await nutritionAPI.generate()
      const r = await nutritionAPI.getToday()
      setTodayMeals(r.data || [])
    } catch {}
    setGeneratingNutrition(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
      </div>
    )
  }

  const displayName = user?.first_name
    ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`
    : 'Atleta'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Bem-vindo, <span className="text-green-500">{displayName}</span>
        </h1>
        <p className="text-gray-400 mt-1">Seu resumo de hoje</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Treino de Hoje</p>
          <p className="text-2xl font-bold text-white mt-1">
            {todayWorkout?.focus || '—'}
          </p>
          <p className="text-green-500 text-sm mt-2">
            {todayWorkout?.session_exercises?.length || 0} exercícios
          </p>
        </div>
        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Refeições Hoje</p>
          <p className="text-2xl font-bold text-white mt-1">
            {todayMeals.length > 0 ? `${todayMeals.length} refeições` : '—'}
          </p>
          <p className="text-yellow-500 text-sm mt-2">
            {todayMeals.length > 0 ? 'Plano ativo' : 'Sem plano ainda'}
          </p>
        </div>
        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Água</p>
          <p className="text-2xl font-bold text-white mt-1">
            {waterToday?.total_ml ? `${waterToday.total_ml} ml` : '—'}
          </p>
          <p className="text-blue-400 text-sm mt-2">
            Meta: {waterToday?.target_ml || 2000} ml
          </p>
        </div>
        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Plano</p>
          <p className="text-2xl font-bold text-white mt-1 capitalize">
            {user?.plan_type || 'free'}
          </p>
          <p className="text-green-500 text-sm mt-2">Ativo</p>
        </div>
      </div>

      {myTrainer && (
        <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xl font-bold">
                {myTrainer.trainer_name?.[0]?.toUpperCase() || 'P'}
              </div>
              <div>
                <p className="text-white font-semibold">Seu Personal: {myTrainer.trainer_name}</p>
                <p className="text-gray-400 text-sm">{myTrainer.specialties || 'Personal Trainer'}</p>
              </div>
            </div>
            <Link
              href={`/chat?user=${myTrainer.user_id || ''}`}
              className="px-4 py-2 bg-green-500 text-black font-bold rounded-xl text-sm hover:bg-green-400 transition-colors"
            >
              💬 Conversar
            </Link>
          </div>
        </div>
      )}

      {!myTrainer && (
        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">Quer um personal trainer?</p>
              <p className="text-gray-400 text-sm">Cadastre-se como professor ou aguarde seu personal te vincular</p>
            </div>
            <Link
              href="/trainer"
              className="px-4 py-2 bg-green-500/10 text-green-500 border border-green-500/30 rounded-xl text-sm hover:bg-green-500/20 transition-colors"
            >
              Ser Professor
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Treino de Hoje</h2>
          {todayWorkout?.session_exercises?.length > 0 ? (
            <div className="space-y-3">
              {todayWorkout.session_exercises.map((se: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <span className="text-gray-300">{se.exercise?.name || `Exercício ${i + 1}`}</span>
                  <span className="text-green-500 text-sm">{se.sets}x{se.reps}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-4">Nenhum treino programado para hoje</p>
              <Link
                href="/workouts"
                className="inline-block px-5 py-2 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition-colors"
              >
                Gerar Treino com IA
              </Link>
            </div>
          )}
        </div>

        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Plano Alimentar</h2>
          {todayMeals.length > 0 ? (
            <div className="space-y-3">
              {todayMeals.map((meal: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <span className="text-gray-300 capitalize">{meal.meal_type}</span>
                  <span className="text-green-500 text-sm">{(meal.meal_items || []).length} itens</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-4">Nenhum plano alimentar programado</p>
              <Link
                href="/nutrition"
                className="inline-block px-5 py-2 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition-colors"
              >
                Gerar Plano com IA
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
