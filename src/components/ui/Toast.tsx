import { Toaster } from 'react-hot-toast'

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
        success: {
          iconTheme: { primary: '#00D4A1', secondary: '#13131A' },
        },
        error: {
          iconTheme: { primary: '#FF4757', secondary: '#13131A' },
        },
      }}
    />
  )
}
