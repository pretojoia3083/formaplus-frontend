'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../../contexts/AuthContext'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'

export default function RegisterPage() {
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return
    }
    setLoading(true)
    try {
      await register(email, password)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-700 rounded-xl flex items-center justify-center text-black font-bold text-2xl">
              F
            </div>
            <span className="text-3xl font-bold">
              Forma<span className="text-green-500">+</span>
            </span>
          </div>
          <p className="text-gray-400 mt-2">Crie sua conta gratuita</p>
        </div>

        <Card variant="gradient">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Senha
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 caracteres"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Confirmar Senha
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              loading={loading}
            >
              Criar Conta
            </Button>

            <p className="text-center text-gray-400 text-sm">
              Já tem uma conta?{' '}
              <Link
                href="/login"
                className="text-green-500 hover:text-green-400 transition-colors"
              >
                Entrar
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}
