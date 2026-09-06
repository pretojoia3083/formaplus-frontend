'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { trainerAPI } from '../../../lib/api'
import toast from 'react-hot-toast'

export default function TrainerRegisterPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [trainerProfile, setTrainerProfile] = useState<any>(null)
  const [checking, setChecking] = useState(true)
  const [form, setForm] = useState({
    full_name: '',
    cref: '',
    bio: '',
    specialties: '',
    experience_years: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login')
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      trainerAPI.getMe().then(r => {
        setTrainerProfile(r.data)
        setChecking(false)
      }).catch(() => setChecking(false))
    }
  }, [isAuthenticated])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.full_name.trim()) {
      toast.error('Preencha seu nome completo')
      return
    }
    setSaving(true)
    try {
      await trainerAPI.register({
        full_name: form.full_name,
        cref: form.cref || undefined,
        bio: form.bio || undefined,
        specialties: form.specialties || undefined,
        experience_years: form.experience_years ? parseInt(form.experience_years) : undefined,
      })
      toast.success('Cadastro realizado! Aguarde aprovação do administrador.')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Erro ao cadastrar')
    }
    setSaving(false)
  }

  if (loading || checking) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
    </div>
  )

  if (trainerProfile) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white">Meu Perfil de Professor</h1>
        <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500/30 flex items-center justify-center text-green-500 text-2xl font-bold">
              {trainerProfile.full_name?.[0]?.toUpperCase() || 'P'}
            </div>
            <div>
              <p className="text-white font-semibold text-lg">{trainerProfile.full_name}</p>
              <p className="text-gray-400 text-sm">CREF: {trainerProfile.cref || 'Não informado'}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Status</span>
              <span className={`font-semibold ${trainerProfile.status === 'approved' ? 'text-green-500' : trainerProfile.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
                {trainerProfile.status === 'approved' ? '✅ Aprovado' : trainerProfile.status === 'rejected' ? '❌ Rejeitado' : '⏳ Aguardando aprovação'}
              </span>
            </div>
            {trainerProfile.specialties && (
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Especialidades</span>
                <span className="text-white text-sm">{trainerProfile.specialties}</span>
              </div>
            )}
            {trainerProfile.experience_years && (
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Experiência</span>
                <span className="text-white text-sm">{trainerProfile.experience_years} anos</span>
              </div>
            )}
            {trainerProfile.bio && (
              <div className="py-2">
                <span className="text-gray-400">Bio</span>
                <p className="text-white text-sm mt-1">{trainerProfile.bio}</p>
              </div>
            )}
          </div>
        </div>
        {trainerProfile.status === 'approved' && (
          <button
            onClick={() => router.push('/trainer/clients')}
            className="w-full py-3 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-colors"
          >
            📋 Gerenciar Alunos
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Cadastro de Professor</h1>
      <p className="text-gray-400">Preencha seus dados para se tornar um personal trainer no Forma+</p>

      <form onSubmit={handleSubmit} className="bg-[#171B1E] border border-gray-800 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-gray-400 text-sm mb-1">Nome Compleito *</label>
          <input
            type="text"
            value={form.full_name}
            onChange={e => setForm({ ...form, full_name: e.target.value })}
            className="w-full px-4 py-3 bg-[#0B0D0F] border border-gray-700 rounded-xl text-white focus:border-green-500 focus:outline-none"
            placeholder="Seu nome completo"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">CREF</label>
          <input
            type="text"
            value={form.cref}
            onChange={e => setForm({ ...form, cref: e.target.value })}
            className="w-full px-4 py-3 bg-[#0B0D0F] border border-gray-700 rounded-xl text-white focus:border-green-500 focus:outline-none"
            placeholder="Ex: 000000-G/SP"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Especialidades</label>
          <input
            type="text"
            value={form.specialties}
            onChange={e => setForm({ ...form, specialties: e.target.value })}
            className="w-full px-4 py-3 bg-[#0B0D0F] border border-gray-700 rounded-xl text-white focus:border-green-500 focus:outline-none"
            placeholder="Ex: Musculação, Funcional, Emagrecimento"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Anos de Experiência</label>
          <input
            type="number"
            value={form.experience_years}
            onChange={e => setForm({ ...form, experience_years: e.target.value })}
            className="w-full px-4 py-3 bg-[#0B0D0F] border border-gray-700 rounded-xl text-white focus:border-green-500 focus:outline-none"
            placeholder="Ex: 5"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Sobre Você</label>
          <textarea
            value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value })}
            className="w-full px-4 py-3 bg-[#0B0D0F] border border-gray-700 rounded-xl text-white focus:border-green-500 focus:outline-none h-24 resize-none"
            placeholder="Conte um pouco sobre sua experiência e abordagem..."
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-colors disabled:opacity-50"
        >
          {saving ? 'Cadastrando...' : 'Enviar Cadastro'}
        </button>
      </form>
    </div>
  )
}
