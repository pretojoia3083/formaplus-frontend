'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { adminAPI } from '../../../lib/admin'
import toast from 'react-hot-toast'

export default function AdminPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [trainers, setTrainers] = useState<any[]>([])
  const [filter, setFilter] = useState<string>('')
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login')
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && user?.email !== 'luisrenatotrader@gmail.com') {
      router.push('/dashboard')
    }
  }, [isAuthenticated, user, router])

  useEffect(() => {
    if (isAuthenticated && user?.email === 'luisrenatotrader@gmail.com') {
      loadData()
    }
  }, [isAuthenticated, user, filter])

  const loadData = async () => {
    setLoadingData(true)
    try {
      const [statsRes, trainersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getTrainers(filter || undefined),
      ])
      setStats(statsRes.data)
      setTrainers(trainersRes.data)
    } catch (err) {
      console.error(err)
    }
    setLoadingData(false)
  }

  const handleApprove = async (id: number) => {
    try {
      await adminAPI.approveTrainer(id)
      toast.success('Professor aprovado!')
      loadData()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Erro')
    }
  }

  const handleReject = async (id: number) => {
    if (!confirm('Rejeitar este professor?')) return
    try {
      await adminAPI.rejectTrainer(id)
      toast.success('Professor rejeitado')
      loadData()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Erro')
    }
  }

  if (loading || loadingData) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
    </div>
  )

  if (user?.email !== 'luisrenatotrader@gmail.com') return null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">⚙️ Painel Admin</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Usuários', value: stats.total_users, color: 'text-white' },
            { label: 'Professores', value: stats.total_trainers, color: 'text-white' },
            { label: 'Aprovados', value: stats.approved_trainers, color: 'text-green-500' },
            { label: 'Pendentes', value: stats.pending_trainers, color: 'text-yellow-500' },
            { label: 'Alunos vinculados', value: stats.total_clients, color: 'text-blue-500' },
            { label: 'Mensagens', value: stats.total_messages, color: 'text-purple-500' },
          ].map((s, i) => (
            <div key={i} className="bg-[#171B1E] border border-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-sm">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Professores</h2>
          <div className="flex gap-2">
            {['', 'pending', 'approved', 'rejected'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-sm ${filter === f ? 'bg-green-500 text-black font-bold' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
              >
                {f === '' ? 'Todos' : f === 'pending' ? 'Pendentes' : f === 'approved' ? 'Aprovados' : 'Rejeitados'}
              </button>
            ))}
          </div>
        </div>

        {trainers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhum professor encontrado</p>
        ) : (
          <div className="space-y-3">
            {trainers.map((t) => (
              <div key={t.id} className="bg-[#0B0D0F] border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 font-bold">
                      {t.full_name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{t.full_name}</p>
                      <p className="text-gray-500 text-sm">{t.email} • CREF: {t.cref || '-'}</p>
                      {t.specialties && <p className="text-gray-500 text-xs">{t.specialties}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      t.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                      t.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {t.status === 'approved' ? 'Aprovado' : t.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                    </span>
                    {t.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(t.id)}
                          className="px-3 py-1 bg-green-500 text-black text-sm font-bold rounded-lg hover:bg-green-400"
                        >
                          ✅ Aprovar
                        </button>
                        <button
                          onClick={() => handleReject(t.id)}
                          className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/30"
                        >
                          ❌
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
