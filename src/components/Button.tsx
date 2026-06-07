import React from 'react'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  loading?: boolean
  children: React.ReactNode
}

export function Button({ variant = 'primary', loading = false, children, className = '', disabled, ...p }: Props) {
  const v = {
    primary: 'grad-btn text-white hover:opacity-90 hover:scale-[1.02]',
    secondary: 'border border-[#e8b44b] text-[#e8b44b] hover:bg-[#e8b44b]/10',
    ghost: 'text-[#8888aa] hover:text-white hover:bg-[#161625]',
    danger: 'bg-[#f43f5e]/20 text-[#f43f5e] border border-[#f43f5e]/30 hover:bg-[#f43f5e]/30',
  }[variant]

  return (
    <button
      className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${v} ${className}`}
      disabled={disabled || loading}
      {...p}
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
