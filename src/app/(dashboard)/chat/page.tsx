'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { chatAPI } from '../../../lib/api'
import toast from 'react-hot-toast'

export default function ChatPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedUserId = searchParams.get('user')

  const [conversations, setConversations] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [activeChat, setActiveChat] = useState<number | null>(selectedUserId ? parseInt(selectedUserId) : null)
  const [activeChatName, setActiveChatName] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login')
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) loadConversations()
  }, [isAuthenticated])

  useEffect(() => {
    if (activeChat) loadMessages(activeChat)
  }, [activeChat])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (selectedUserId) {
      setActiveChat(parseInt(selectedUserId))
      const conv = conversations.find(c => c.user_id === parseInt(selectedUserId))
      if (conv) setActiveChatName(conv.user_name)
    }
  }, [selectedUserId, conversations])

  const loadConversations = async () => {
    try {
      const r = await chatAPI.getConversations()
      setConversations(r.data)
    } catch (err) {
      console.error(err)
    }
  }

  const loadMessages = async (userId: number) => {
    setLoadingMessages(true)
    try {
      const r = await chatAPI.getMessages(userId)
      setMessages(r.data)
      const conv = conversations.find(c => c.user_id === userId)
      if (conv) setActiveChatName(conv.user_name)
    } catch (err) {
      console.error(err)
    }
    setLoadingMessages(false)
  }

  const handleSend = async () => {
    if (!newMessage.trim() || !activeChat) return
    setSending(true)
    try {
      const r = await chatAPI.send(activeChat, newMessage)
      setMessages([...messages, r.data])
      setNewMessage('')
      loadConversations()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Erro ao enviar')
    }
    setSending(false)
  }

  const formatTime = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
    </div>
  )

  return (
    <div className="flex h-[calc(100vh-120px)] gap-0 bg-[#171B1E] border border-gray-800 rounded-xl overflow-hidden">
      {/* Sidebar */}
      <div className={`${activeChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-gray-800`}>
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-lg font-bold text-white">💬 Chat</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">Nenhuma conversa</p>
              <p className="text-gray-600 text-sm mt-1">Seu professor vai aparecer aqui</p>
            </div>
          ) : (
            conversations.map((c) => (
              <button
                key={c.user_id}
                onClick={() => { setActiveChat(c.user_id); setActiveChatName(c.user_name) }}
                className={`w-full p-4 flex items-center gap-3 hover:bg-gray-800/50 transition-colors border-b border-gray-800/50 ${activeChat === c.user_id ? 'bg-green-500/10' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 font-bold flex-shrink-0">
                  {c.user_name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{c.user_name}</p>
                  <p className="text-gray-500 text-xs truncate">{c.last_message}</p>
                </div>
                {c.unread_count > 0 && (
                  <span className="w-5 h-5 bg-green-500 text-black text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                    {c.unread_count}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${activeChat ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
        {activeChat ? (
          <>
            <div className="p-4 border-b border-gray-800 flex items-center gap-3">
              <button
                onClick={() => setActiveChat(null)}
                className="md:hidden text-gray-400 hover:text-white"
              >
                ←
              </button>
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 font-bold text-sm">
                {activeChatName?.[0]?.toUpperCase() || '?'}
              </div>
              <span className="text-white font-semibold">{activeChatName}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingMessages ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Inicie a conversa!</p>
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                      m.sender_id === user?.id
                        ? 'bg-green-500 text-black rounded-br-sm'
                        : 'bg-gray-800 text-white rounded-bl-sm'
                    }`}>
                      <p className="text-sm">{m.message}</p>
                      <p className={`text-xs mt-1 ${m.sender_id === user?.id ? 'text-black/50' : 'text-gray-500'}`}>
                        {formatTime(m.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-800">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-3 bg-[#0B0D0F] border border-gray-700 rounded-xl text-white focus:border-green-500 focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !newMessage.trim()}
                  className="px-6 py-3 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-colors disabled:opacity-50"
                >
                  {sending ? '...' : 'Enviar'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 text-lg">Selecione uma conversa</p>
              <p className="text-gray-600 text-sm mt-1">Escolha um contato ao lado para iniciar o chat</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
