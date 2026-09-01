'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { progressAPI } from '../../../lib/api'

export default function ProgressPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [weight, setWeight] = useState('')
  const [water, setWater] = useState('')
  const [steps, setSteps] = useState('')
  const [waterToday, setWaterToday] = useState(0)
  const [stepsToday, setStepsToday] = useState(0)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login')
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      progressAPI.getWaterToday().then(r => setWaterToday(r.data?.total_ml || 0)).catch(() => {})
      progressAPI.getStepsToday().then(r => setStepsToday(r.data?.steps || 0)).catch(() => {})
      progressAPI.getStreak().then(r => setStreak(r.data?.streak || 0)).catch(() => {})
    }
  }, [isAuthenticated])

  const logWeight = async () => {
    if (!weight) return
    await progressAPI.logWeight({ weight_kg: parseFloat(weight) })
    setWeight('')
  }

  const logWater = async (ml: number) => {
    await progressAPI.logWater({ amount_ml: ml })
    setWaterToday(prev => prev + ml)
  }

  const logSteps = async () => {
    if (!steps) return
    await progressAPI.logSteps({ steps: parseInt(steps) })
    setStepsToday(prev => prev + parseInt(steps))
    setSteps('')
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" /></div>

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Evolução</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-400 text-sm">Sequência</p>
          <p className="text-3xl font-bold text-green-500 mt-1">{streak} dias</p>
        </div>
        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-400 text-sm">Água Hoje</p>
          <p className="text-3xl font-bold text-blue-400 mt-1">{waterToday} ml</p>
          <p className="text-gray-500 text-xs mt-1">Meta: 2.000 ml</p>
        </div>
        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-400 text-sm">Passos Hoje</p>
          <p className="text-3xl font-bold text-yellow-400 mt-1">{stepsToday.toLocaleString()}</p>
          <p className="text-gray-500 text-xs mt-1">Meta: 10.000</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Registrar Peso</h2>
          <div className="flex gap-2">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="kg"
              step="0.1"
              className="flex-1 px-3 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
            <button onClick={logWeight} className="px-4 py-2 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition-colors">
              Salvar
            </button>
          </div>
        </div>

        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Registrar Água</h2>
          <div className="flex gap-2">
            {[250, 500, 750].map(ml => (
              <button
                key={ml}
                onClick={() => logWater(ml)}
                className="flex-1 px-3 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-colors text-sm"
              >
                +{ml}ml
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Registrar Passos</h2>
          <div className="flex gap-2">
            <input
              type="number"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="passos"
              className="flex-1 px-3 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
            <button onClick={logSteps} className="px-4 py-2 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition-colors">
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
