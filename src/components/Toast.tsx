import { Toaster } from 'react-hot-toast'

export function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#0f0f1a',
          color: '#f0f0ff',
          border: '1px solid #1e1e35',
          borderRadius: '12px',
        },
        success: { iconTheme: { primary: '#10d9a0', secondary: '#0f0f1a' } },
        error: { iconTheme: { primary: '#f43f5e', secondary: '#0f0f1a' } },
      }}
    />
  )
}
