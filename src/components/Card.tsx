import React from 'react'

interface Props {
  children: React.ReactNode
  className?: string
  glow?: boolean
}

export function Card({ children, className = '', glow = false }: Props) {
  return (
    <div
      className={`card transition-all duration-200 ${
        glow
          ? 'hover:border-[#e8b44b]/40 hover:shadow-[0_0_30px_rgba(232,180,75,0.15)]'
          : 'hover:border-[#2a2a45]'
      } ${className}`}
    >
      {children}
    </div>
  )
}
