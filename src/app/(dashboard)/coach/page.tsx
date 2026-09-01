'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { coachAPI } from '../../../lib/api'

export default function CoachPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [conversationId, setConversationId] = useState<number | undefined>()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login')
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || sending) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setSending(true)

    try {
      const res = await coachAPI.sendMessage({
        user_id: user?.id || 0,
        user_message: userMsg,
        conversation_id: conversationId,
      })
      const data = res.data
      if (data.conversation_id) setConversationId(data.conversation_id)
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || data.message || 'Resposta recebida' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Desculpe, não consegui processar sua mensagem.' }])
    }
    setSending(false)
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" /></div>

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold text-white mb-4">Coach IA</h1>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="bg-[#171B1E] border border-gray-800 rounded-xl p-8 text-center">
            <p className="text-4xl mb-3">🏋️</p>
            <p className="text-gray-400">Olá! Sou seu coach de fitness. Pergunte sobre treinos, nutrição ou dicas de saúde.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
              msg.role === 'user'
                ? 'bg-green-500 text-black rounded-br-sm'
                : 'bg-[#171B1E] border border-gray-800 text-gray-200 rounded-bl-sm'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-[#171B1E] border border-gray-800 text-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce" style={{animationDelay: '0.1s'}}>●</span>
                <span className="animate-bounce" style={{animationDelay: '0.2s'}}>●</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Digite sua mensagem..."
          className="flex-1 px-4 py-3 bg-[#171B1E] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
          disabled={sending}
        />
        <button
          onClick={handleSend}
          disabled={sending || !input.trim()}
          className="px-6 py-3 bg-green-500 text-black font-semibold rounded-xl hover:bg-green-400 transition-colors disabled:opacity-50"
        >
          Enviar
        </button>
      </div>
    </div>
  )
}
