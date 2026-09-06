'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { trainerAPI, chatAPI } from '../../../lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function TrainerClientsPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [clients, setClients] = useState<any[]>([])
  const [email, setEmail] = useState('')
  const [adding, setAdding] = useState(false)
  const [loadingClients, setLoadingClients] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login')
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) loadClients()
  }, [isAuthenticated])

  const loadClients = async () => {
    try {
      const r = await trainerAPI.getClients()
      setClients(r.data)
    } catch (err) {
      toast.error('Erro ao carregar alunos')
    }
    setLoadingClients(false)
  }

  const handleAddClient = async () => {
    if (!email.trim()) {
      toast.error('Digite o email do aluno')
      return
    }
    setAdding(true)
    try {
      await trainerAPI.assignClient(email)
      toast.success('Aluno adicionado!')
      setEmail('')
      loadClients()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Erro ao adicionar aluno')
    }
    setAdding(false)
  }

  const handleRemoveClient = async (clientId: number) => {
    if (!confirm('Remover este aluno?')) return
    try {
      await trainerAPI.removeClient(clientId)
      toast.success('Aluno removido')
      loadClients()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Erro ao remover')
    }
  }

  if (loading || loadingClients) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">📋 Meus Alunos</h1>
        <Link href="/chat" className="px-4 py-2 bg-green-500/10 text-green-500 border border-green-500/30 rounded-xl text-sm hover:bg-green-500/20 transition-colors">
          💬 Chat
        </Link>
      </div>

      <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-3">Adicionar Aluno</h2>
        <div className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email do aluno"
            className="flex-1 px-4 py-3 bg-[#0B0D0F] border border-gray-700 rounded-xl text-white focus:border-green-500 focus:outline-none"
            onKeyDown={e => e.key === 'Enter' && handleAddClient()}
          />
          <button
            onClick={handleAddClient}
            disabled={adding}
            className="px-6 py-3 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-colors disabled:opacity-50"
          >
            {adding ? '...' : 'Adicionar'}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {clients.length === 0 ? (
          <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-400 text-lg">Nenhum aluno ainda</p>
            <p className="text-gray-500 text-sm mt-2">Adicione o email do aluno acima para vinculá-lo</p>
          </div>
        ) : (
          clients.map((c) => (
            <div key={c.id} className="bg-[#171B1E] border border-gray-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 font-bold">
                  {c.client_name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-white font-semibold">{c.client_name}</p>
                  <p className="text-gray-500 text-sm">{c.client_email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/chat?user=${c.user_id}`}
                  className="px-3 py-2 bg-green-500/10 text-green-500 rounded-lg text-sm hover:bg-green-500/20 transition-colors"
                >
                  💬
                </Link>
                <button
                  onClick={() => handleRemoveClient(c.id)}
                  className="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm hover:bg-red-500/20 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
