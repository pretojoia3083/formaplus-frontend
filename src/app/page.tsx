'use client'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Dumbbell, Apple, Brain, TrendingUp, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-500/5" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center">
            <img src="/images/logo.png" alt="Forma+" className="h-32 w-auto mx-auto mb-8" />
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              Seu corpo. Sua mente.{' '}
              <span className="text-[#20E58A]">Sua evolução.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Treinos e planos alimentares personalizados por inteligência artificial.
              Acompanhe sua evolução, converse com um coach virtual e alcance seus objetivos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button fullWidth className="text-lg px-8 py-3">
                  Comece Grátis
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" fullWidth className="text-lg px-8 py-3">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">
          Tudo que você precisa para <span className="text-[#20E58A]">evoluir</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Dumbbell, title: 'Treinos IA', desc: 'Planos de treino personalizados gerados por inteligência artificial baseados no seu perfil e objetivos.' },
            { icon: Apple, title: 'Nutrição', desc: 'Planos alimentares adaptados ao seu estilo de vida, com estimativas de macros e calorias.' },
            { icon: Brain, title: 'Coach Virtual', desc: 'Converse com um coach de fitness 24/7 que responde suas dúvidas e motiva você.' },
            { icon: TrendingUp, title: 'Evolução', desc: 'Acompanhe seu peso, medidas e desempenho ao longo do tempo com gráficos detalhados.' },
            { icon: Shield, title: 'Seguro e Privado', desc: 'Seus dados estão protegidos. Apenas você tem acesso às suas informações.' },
            { icon: Zap, title: 'Rápido e Fácil', desc: 'Interface intuitiva que funciona no celular e computador. Comece em segundos.' },
          ].map((feature, i) => (
            <div key={i} className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 hover:border-[#20E58A]/30 transition-all duration-300">
              <div className="w-12 h-12 bg-[#20E58A]/10 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-[#20E58A]" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-[#20E58A]/10 to-[#20E58A]/5 border border-[#20E58A]/20 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-gray-400 mb-8 text-lg">Crie sua conta gratuita e comece sua jornada hoje.</p>
          <Link href="/register">
            <Button className="text-lg px-8 py-3">
              Criar Conta Grátis
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Forma+ © 2026. Seu corpo. Sua mente. Sua evolução.</p>
        </div>
      </footer>
    </div>
  )
}
