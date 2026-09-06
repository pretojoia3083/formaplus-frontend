'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { chatAPI } from '../../lib/api'
import { 
  HomeIcon, 
  DumbbellIcon, 
  AppleIcon, 
  MessageCircleIcon, 
  ChatBubbleIcon,
  ChartLineIcon,
  UserIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
  { href: '/workouts', icon: DumbbellIcon, label: 'Treinos' },
  { href: '/nutrition', icon: AppleIcon, label: 'Alimentação' },
  { href: '/coach', icon: MessageCircleIcon, label: 'Coach' },
  { href: '/chat', icon: ChatBubbleIcon, label: 'Chat' },
  { href: '/progress', icon: ChartLineIcon, label: 'Evolução' },
]

export const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/')

  useEffect(() => {
    const interval = setInterval(() => {
      chatAPI.getUnreadCount().then(r => setUnreadCount(r.data.count)).catch(() => {})
    }, 10000)
    chatAPI.getUnreadCount().then(r => setUnreadCount(r.data.count)).catch(() => {})
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="border-b border-gray-800 bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Forma+" className="h-14 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-green-500/10 text-green-500'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.href === '/chat' && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-green-500" />
              </div>
              <span className="hidden sm:inline text-sm">{user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.email || 'Usuário'}</span>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="hidden sm:flex"
            >
              <LogOutIcon className="w-4 h-4" />
            </Button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? (
                <XIcon className="w-5 h-5" />
              ) : (
                <MenuIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-green-500/10 text-green-500'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.href === '/chat' && unreadCount > 0 && (
                      <span className="ml-auto w-5 h-5 bg-green-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                )
              })}
              <button
                onClick={() => {
                  logout()
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <LogOutIcon className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
