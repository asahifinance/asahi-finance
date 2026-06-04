// ============================================
// ALL UI COMPONENTS IN ONE FILE
// ============================================

import React from 'react'
import { Toaster } from 'react-hot-toast'

// ---- CARD ----
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
      className={`rounded-2xl bg-[#13131A] border border-[#1E1E2E] p-5 transition-all duration-200
        ${glow ? 'hover:shadow-[0_0_20px_rgba(245,166,35,0.3)] hover:border-[#F5A623]/30' : 'hover:border-[#2A2A3E]'}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}`}
    >
      {children}
    </div>
  )
}

// ---- BUTTON ----
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base = 'font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center'
  const sizes: Record<string, string> = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5', lg: 'px-7 py-3.5 text-lg' }
  const variants: Record<string, string> = {
    primary: 'bg-gradient-to-r from-[#F5A623] via-[#C0392B] to-[#8E44AD] text-white hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(245,166,35,0.3)]',
    secondary: 'border border-[#F5A623] text-[#F5A623] hover:bg-[#F5A623]/10',
    ghost: 'text-[#8B8B9E] hover:text-white hover:bg-[#1A1A24]',
    danger: 'bg-[#FF4757]/20 text-[#FF4757] border border-[#FF4757]/30 hover:bg-[#FF4757]/30',
  }
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}

// ---- BADGE ----
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

// ---- TOAST ----
export function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#13131A',
          color: '#FFFFFF',
          border: '1px solid #1E1E2E',
          borderRadius: '12px',
          fontFamily: 'DM Sans, sans-serif',
        },
        success: { iconTheme: { primary: '#00D4A1', secondary: '#13131A' } },
        error: { iconTheme: { primary: '#FF4757', secondary: '#13131A' } },
      }}
    />
  )
}
