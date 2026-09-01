import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Forma+ - Seu corpo. Sua mente. Sua evolução.',
  description: 'Plataforma SaaS de treino e nutrição personalizada por IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          {children}
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
