import React from 'react'

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
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5', lg: 'px-7 py-3.5 text-lg' }
  const variants = {
    primary: 'bg-gradient-brand text-white hover:scale-[1.02] hover:shadow-glow-gold',
    secondary: 'border border-gold text-gold hover:bg-gold/10',
    ghost: 'text-text-secondary hover:text-white hover:bg-bg-elevated',
    danger: 'bg-danger/20 text-danger border border-danger/30 hover:bg-danger/30',
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
