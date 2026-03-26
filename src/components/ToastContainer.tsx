import type { Toast } from '../App'

interface Props {
  toasts: Toast[]
}

const COLORS: Record<Toast['type'], string> = {
  success: '#1a8a1a',
  error: '#cc2233',
  info: '#0066cc',
}

export default function ToastContainer({ toasts }: Props) {
  if (toasts.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      zIndex: 9999,
    }}>
      {toasts.map(toast => (
        <div key={toast.id} style={{
          padding: '10px 16px',
          background: COLORS[toast.type],
          color: '#fff',
          borderRadius: 5,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          animation: 'fadeIn 0.2s ease',
        }}>
          {toast.message}
        </div>
      ))}
    </div>
  )
}
