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
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login')
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) loadConversations()
  }, [isAuthenticated])

  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat)
      inputRef.current?.focus()
    }
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
    const msgText = newMessage.trim()
    setNewMessage('')
    setSending(true)
    try {
      const r = await chatAPI.send(activeChat, msgText)
      setMessages(prev => [...prev, r.data])
      loadConversations()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Erro ao enviar')
      setNewMessage(msgText)
    }
    setSending(false)
  }

  const formatTime = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (d.toDateString() === today.toDateString()) return 'Hoje'
    if (d.toDateString() === yesterday.toDateString()) return 'Ontem'
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  const shouldShowDate = (index: number) => {
    if (index === 0) return true
    const curr = new Date(messages[index].created_at)
    const prev = new Date(messages[index - 1].created_at)
    return curr.toDateString() !== prev.toDateString()
  }

  const getInitials = (name: string) => {
    if (!name) return '?'
    const parts = name.split(' ').filter(Boolean)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return parts[0][0].toUpperCase()
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
    </div>
  )

  return (
    <div className="flex h-[calc(100vh-100px)] bg-[#111B21] rounded-xl overflow-hidden border border-gray-800">
      {/* Sidebar */}
      <div className={`${activeChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[340px] bg-[#1F2C34] border-r border-gray-700/50`}>
        <div className="p-4 bg-[#1F2C34] border-b border-gray-700/50">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-green-500">💬</span> Conversas
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <p className="text-gray-400">Nenhuma conversa ainda</p>
              <p className="text-gray-600 text-sm mt-1">Seu personal vai aparecer aqui</p>
            </div>
          ) : (
            conversations.map((c) => (
              <button
                key={c.user_id}
                onClick={() => { setActiveChat(c.user_id); setActiveChatName(c.user_name) }}
                className={`w-full p-3 flex items-center gap-3 hover:bg-white/5 transition-colors border-b border-gray-700/30 ${activeChat === c.user_id ? 'bg-green-500/10' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg">
                  {getInitials(c.user_name)}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-semibold text-sm truncate">{c.user_name}</p>
                    <span className="text-gray-500 text-xs flex-shrink-0 ml-2">{formatTime(c.last_message_at)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-gray-400 text-xs truncate">{c.last_message || 'Nenhuma mensagem'}</p>
                    {c.unread_count > 0 && (
                      <span className="w-5 h-5 bg-green-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                        {c.unread_count > 9 ? '9+' : c.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${activeChat ? 'flex' : 'hidden md:flex'} flex-col flex-1 bg-[#0B141A]`}>
        {activeChat ? (
          <>
            {/* Header */}
            <div className="px-4 py-3 bg-[#1F2C34] border-b border-gray-700/50 flex items-center gap-3">
              <button
                onClick={() => setActiveChat(null)}
                className="md:hidden text-gray-400 hover:text-white p-1"
              >
                ←
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {getInitials(activeChatName)}
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{activeChatName}</p>
                <p className="text-green-500 text-xs">{typing ? 'digitando...' : 'online'}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}>
              {loadingMessages ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">💬</span>
                  </div>
                  <p className="text-gray-400 text-lg">Inicie a conversa!</p>
                  <p className="text-gray-600 text-sm mt-1">Envie uma mensagem para {activeChatName}</p>
                </div>
              ) : (
                messages.map((m, i) => {
                  const isMe = m.sender_id === user?.id
                  const showDate = shouldShowDate(i)
                  const showTime = i === messages.length - 1 || 
                    messages[i + 1]?.sender_id !== m.sender_id ||
                    new Date(messages[i + 1].created_at).getTime() - new Date(m.created_at).getTime() > 60000

                  return (
                    <React.Fragment key={m.id}>
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <span className="px-3 py-1 bg-[#1F2C34] text-gray-400 text-xs rounded-lg shadow-sm">
                            {formatDate(m.created_at)}
                          </span>
                        </div>
                      )}
                      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${showTime ? 'mb-2' : 'mb-0.5'}`}>
                        <div className={`relative max-w-[75%] px-3 py-2 rounded-xl shadow-sm ${
                          isMe
                            ? 'bg-[#005C4B] text-white rounded-br-sm'
                            : 'bg-[#202C33] text-white rounded-bl-sm'
                        }`}>
                          <p className="text-[14.5px] leading-[19px] whitespace-pre-wrap break-words">{m.message}</p>
                          <div className={`flex items-center gap-1 justify-end -mb-0.5 mt-0.5 ${isMe ? 'text-white/50' : 'text-gray-500'}`}>
                            <span className="text-[11px]">{formatTime(m.created_at)}</span>
                            {isMe && (
                              <span className="text-[11px]">
                                {m.is_read ? '✓✓' : '✓'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 bg-[#1F2C34] border-t border-gray-700/50">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 px-4 py-2.5 bg-[#2A3942] border-none rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500/50 text-[15px]"
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !newMessage.trim()}
                  className="w-10 h-10 bg-green-500 text-black rounded-full flex items-center justify-center hover:bg-green-400 transition-colors disabled:opacity-50 flex-shrink-0"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"/>
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#0B141A]">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#20E58A" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Forma+ Chat</h2>
              <p className="text-gray-500">Envie mensagens para seu personal trainer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
