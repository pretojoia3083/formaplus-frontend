import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import { PWABanner } from '../components/PWABanner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Forma+ - Seu corpo. Sua mente. Sua evolução.',
  description: 'Treinos e planos alimentares personalizados por IA. Baixe grátis!',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Forma+',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: '#20E58A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="apple-touch-icon" href="/images/logo-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js')
            })
          }
        `}} />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <PWABanner />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#171B1E',
                color: '#F7F9F8',
                border: '1px solid #20E58A',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
