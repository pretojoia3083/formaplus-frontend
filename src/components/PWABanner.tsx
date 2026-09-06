'use client'
import React, { useState, useEffect } from 'react'

export const PWABanner: React.FC = () => {
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    const ua = navigator.userAgent
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const wasDismissed = localStorage.getItem('pwa_banner_dismissed')
    const ios = /iPhone|iPad|iPod/i.test(ua)
    
    setIsIOS(ios)
    
    if (isStandalone || wasDismissed) return

    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      if (isMobile) {
        setTimeout(() => setShow(true), 2000)
      }
    })

    if (isMobile) {
      setTimeout(() => setShow(true), 2000)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShow(false)
      }
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShow(false)
    localStorage.setItem('pwa_banner_dismissed', 'true')
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="bg-[#171B1E] border border-green-500/30 rounded-2xl p-5 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">📱</span>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">Instale o Forma+ no celular</h3>
            
            {isIOS ? (
              <div className="mt-2">
                <p className="text-gray-400 text-sm">
                  1. Toque no botão <strong className="text-white">📤 Compartilhar</strong> (barra inferior)
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  2. Role e toque em <strong className="text-white">Adicionar à Tela de Início</strong>
                </p>
              </div>
            ) : (
              <div className="mt-2">
                {deferredPrompt ? (
                  <p className="text-gray-400 text-sm">
                    Toque no botão abaixo para instalar!
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm">
                    Toque nos <strong className="text-white">⋮</strong> → <strong className="text-white">Instalar app</strong>
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 mt-4">
              {!isIOS && deferredPrompt && (
                <button
                  onClick={handleInstall}
                  className="px-5 py-2.5 bg-green-500 text-black font-bold rounded-xl text-sm hover:bg-green-400 transition-colors"
                >
                  📲 Instalar Agora
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-gray-500 text-sm hover:text-gray-300 transition-colors"
              >
                {isIOS ? 'Entendi!' : 'Fechar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
