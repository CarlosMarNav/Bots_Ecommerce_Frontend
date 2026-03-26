import { Badge } from 'sendingbay-ui'

interface Props {
  activeCount: number
}

export default function AppHeader({ activeCount }: Props) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      borderBottom: '1px solid var(--color-border-primary)',
      background: 'rgba(255,255,255,0.98)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      gap: 18,
      height: 64,
    }}>
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <img src="/logo-sendingbay.png" alt="SendingBay" style={{ height: 30, width: 'auto' }} />
      </a>

      <div style={{ width: 1, height: 26, background: 'var(--color-border-secondary)' }} />

      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: 3,
        color: 'var(--color-text-secondary)',
        textTransform: 'uppercase',
      }}>
        Bot Control
      </span>

      <div style={{ flex: 1 }} />

      <Badge
        label={`${activeCount} ACTIVOS`}
        color={activeCount > 0 ? 'success' : 'gray'}
        size="sm"
        dot={activeCount > 0}
      />
    </header>
  )
}
