import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
  onClick?: () => void
}

export function Card({ children, className = '', glow = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl bg-bg-surface border border-border p-5 transition-all duration-200
        ${glow ? 'hover:shadow-glow-gold hover:border-gold/30' : 'hover:border-border-light'}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}`}
    >
      {children}
    </div>
  )
}
