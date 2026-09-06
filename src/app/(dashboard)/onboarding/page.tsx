'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { authAPI } from '../../../lib/api'

const steps = [
  {
    id: 'welcome',
    emoji: '👋',
    title: 'Vamos conhecer você!',
    subtitle: 'Precisamos de algumas informações para personalizar seu plano.',
  },
  {
    id: 'gender',
    emoji: '🧑',
    title: 'Qual seu sexo biológico?',
    options: [
      { value: 'male', label: '👨 Masculino', desc: 'Homem' },
      { value: 'female', label: '👩 Feminino', desc: 'Mulher' },
      { value: 'other', label: '⚧ Outro', desc: 'Outro' },
    ],
  },
  {
    id: 'age',
    emoji: '🎂',
    title: 'Qual sua idade?',
    type: 'number',
    placeholder: 'Ex: 28',
  },
  {
    id: 'height',
    emoji: '📏',
    title: 'Qual sua altura? (cm)',
    type: 'number',
    placeholder: 'Ex: 175',
  },
  {
    id: 'weight',
    emoji: '⚖️',
    title: 'Qual seu peso atual? (kg)',
    type: 'number',
    placeholder: 'Ex: 80',
  },
  {
    id: 'goal',
    emoji: '🎯',
    title: 'Qual seu objetivo principal?',
    options: [
      { value: 'lose_weight', label: '🔥 Perder peso', desc: 'Queimar gordura e emagrecer' },
      { value: 'gain_muscle', label: '💪 Ganhar massa muscular', desc: 'Hipertrofia e força' },
      { value: 'maintain', label: '⚖️ Manter o peso', desc: 'Manter peso e forma atual' },
      { value: 'improve_conditioning', label: '🏃 Melhorar condicionamento', desc: 'Resistência e saúde' },
    ],
  },
  {
    id: 'experience',
    emoji: '📊',
    title: 'Qual seu nível de experiência?',
    options: [
      { value: 'beginner', label: '🌱 Iniciante', desc: 'Nunca treinou ou treinou pouco' },
      { value: 'intermediate', label: '🔥 Intermediário', desc: '1-3 anos de treino' },
      { value: 'advanced', label: '🏆 Avançado', desc: 'Mais de 3 anos treinando' },
    ],
  },
  {
    id: 'days',
    emoji: '📅',
    title: 'Quantos dias por semana você pode treinar?',
    options: [
      { value: '2', label: '2️⃣ 2 dias', desc: 'Mínimo para resultados' },
      { value: '3', label: '3️⃣ 3 dias', desc: 'Ideal para iniciantes' },
      { value: '4', label: '4️⃣ 4 dias', desc: 'Bom equilíbrio' },
      { value: '5', label: '5️⃣ 5 dias', desc: 'Avançado' },
      { value: '6', label: '6️⃣ 6 dias', desc: 'Máximo' },
    ],
  },
  {
    id: 'duration',
    emoji: '⏱️',
    title: 'Quanto tempo por sessão?',
    options: [
      { value: '30', label: '⚡ 30 min', desc: 'Treino rápido e intenso' },
      { value: '45', label: '🏃 45 min', desc: 'Ideal para a maioria' },
      { value: '60', label: '💪 60 min', desc: 'Treino completo' },
      { value: '90', label: '🏋️ 90 min', desc: 'Treino longo' },
    ],
  },
  {
    id: 'location',
    emoji: '📍',
    title: 'Onde você vai treinar?',
    options: [
      { value: 'gym', label: '🏋️ Academia', desc: 'Equipamentos completos' },
      { value: 'home', label: '🏠 Casa', desc: 'Treino em casa' },
    ],
  },
  {
    id: 'intensity',
    emoji: '🔥',
    title: 'Qual intensidade você prefere?',
    options: [
      { value: 'light', label: '😊 Leve', desc: 'Confortável, sem sofrer' },
      { value: 'moderate', label: '💪 Moderado', desc: 'Desafiador mas sustentável' },
      { value: 'intense', label: '🔥 Intenso', desc: 'Máximo esforço, rápido!' },
    ],
  },
  {
    id: 'water',
    emoji: '💧',
    title: 'Quantos copos de água por dia você bebe?',
    options: [
      { value: '1-2', label: '😟 1-2 copos', desc: 'Pouca água' },
      { value: '3-5', label: '😐 3-5 copos', desc: 'Razoável' },
      { value: '6-8', label: '😊 6-8 copos', desc: 'Bom!' },
      { value: '8+', label: '🏆 8+ copos', desc: 'Excelente!' },
    ],
  },
  {
    id: 'schedule',
    emoji: '🕐',
    title: 'Qual melhor horário para treinar?',
    options: [
      { value: 'morning', label: '🌅 Manhã (6h-12h)', desc: 'Comece o dia com energia' },
      { value: 'afternoon', label: '☀️ Tarde (12h-18h)', desc: 'Horário intermediário' },
      { value: 'evening', label: '🌙 Noite (18h-22h)', desc: 'Descarregar o dia' },
    ],
  },
  {
    id: 'done',
    emoji: '🎉',
    title: 'Tudo pronto!',
    subtitle: 'Vamos gerar seu plano personalizado com IA!',
  },
]

export default function OnboardingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<any>({
    sex: 'male',
    age: null,
    height_cm: null,
    weight_kg: null,
    goal_type: 'gain_muscle',
    experience_level: 'beginner',
    training_days_per_week: 3,
    session_duration_min: 45,
    location: 'gym',
    activity_level: 'moderately_active',
  })
  const [saving, setSaving] = useState(false)

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleSelect = (field: string, value: string) => {
    setData({ ...data, [field]: value })
  }

  const handleNext = async () => {
    if (step.id === 'intensity') {
      const map: any = { light: 'lightly_active', moderate: 'moderately_active', intense: 'very_active' }
      setData({ ...data, activity_level: map[data.activity_level] || data.activity_level })
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setSaving(true)
      try {
        await authAPI.saveOnboarding(data)
        router.push('/dashboard')
      } catch (err) {
        console.error(err)
      }
      setSaving(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const renderStep = () => {
    if (step.id === 'welcome' || step.id === 'done') {
      return (
        <div className="text-center">
          <div className="text-7xl mb-6">{step.emoji}</div>
          <h2 className="text-3xl font-bold text-white mb-3">{step.title}</h2>
          <p className="text-gray-400 text-lg">{step.subtitle}</p>
        </div>
      )
    }

    if (step.type === 'number') {
      return (
        <div className="text-center">
          <div className="text-6xl mb-4">{step.emoji}</div>
          <h2 className="text-2xl font-bold text-white mb-6">{step.title}</h2>
          <input
            type="number"
            placeholder={step.placeholder}
            value={data[step.id === 'age' ? 'age' : step.id === 'height' ? 'height_cm' : 'weight_kg'] || ''}
            onChange={(e) => {
              const field = step.id === 'age' ? 'age' : step.id === 'height' ? 'height_cm' : 'weight_kg'
              setData({ ...data, [field]: Number(e.target.value) })
            }}
            className="w-full max-w-xs mx-auto px-6 py-4 bg-[#171B1E] border border-gray-700 rounded-xl text-white text-center text-2xl placeholder-gray-500 focus:outline-none focus:border-green-500"
          />
        </div>
      )
    }

    if (step.options) {
      return (
        <div className="text-center">
          <div className="text-6xl mb-4">{step.emoji}</div>
          <h2 className="text-2xl font-bold text-white mb-6">{step.title}</h2>
          <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
            {step.options.map((opt) => {
              const field = step.id === 'gender' ? 'sex' : step.id === 'goal' ? 'goal_type' : step.id === 'experience' ? 'experience_level' : step.id === 'days' ? 'training_days_per_week' : step.id === 'duration' ? 'session_duration_min' : step.id === 'intensity' ? 'activity_level' : step.id
              const isSelected = String(data[field]) === String(opt.value)
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(field, opt.value)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    isSelected
                      ? 'bg-green-500/10 border-green-500 text-green-400'
                      : 'bg-[#171B1E] border-gray-800 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <span className="text-lg font-semibold">{opt.label}</span>
                  <p className="text-sm text-gray-500 mt-1">{opt.desc}</p>
                </button>
              )
            })}
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-[#0B0D0F] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-gray-500 text-sm mt-2 text-center">
            {currentStep + 1} de {steps.length}
          </p>
        </div>

        <div className="mb-10">
          {renderStep()}
        </div>

        <div className="flex gap-3 justify-center">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Voltar
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={saving}
            className="px-8 py-3 bg-green-500 text-black font-semibold rounded-xl hover:bg-green-400 transition-colors disabled:opacity-50"
          >
            {saving ? 'Salvando...' : currentStep === steps.length - 1 ? '🚀 Começar!' : 'Próximo →'}
          </button>
        </div>
      </div>
    </div>
  )
}
