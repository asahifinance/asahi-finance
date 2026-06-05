import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  color?: string
  className?: string
}

export function Badge({ children, color, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}
      style={color ? { color, backgroundColor: `${color}20`, border: `1px solid ${color}40` } : {}}
    >
      {children}
    </span>
  )
}
