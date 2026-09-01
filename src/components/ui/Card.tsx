import React from 'react'
import { twMerge } from 'tailwind-merge'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'gradient' | 'outline'
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  hover = false,
}) => {
  const variants = {
    default: 'bg-black-light border border-gray-800',
    gradient: 'gradient-border bg-black',
    outline: 'border border-green-500/30 bg-black/50',
  }

  return (
    <div
      className={twMerge(
        'rounded-xl p-6 transition-all duration-200',
        variants[variant],
        hover && 'hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10',
        className
      )}
    >
      {children}
    </div>
  )
}
