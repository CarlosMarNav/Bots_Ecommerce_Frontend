import { Badge } from 'sendingbay-ui'
import type { Run } from '../types'

interface Props {
  runs: Run[]
  currentRunId: string | null
  onSelect: (run: Run) => void
}

const STATUS_COLOR: Record<Run['status'], string> = {
  running: '#1a8a1a',
  completed: '#44cc88',
  failed: '#cc2233',
  stopped: '#c07800',
}

const STATUS_BADGE: Record<Run['status'], 'success' | 'error' | 'warning' | 'gray'> = {
  running: 'success',
  completed: 'success',
  failed: 'error',
  stopped: 'warning',
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
}

export default function RunSidebar({ runs, currentRunId, onSelect }: Props) {
  return (
    <>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        letterSpacing: 3,
        color: 'var(--color-text-tertiary)',
        textTransform: 'uppercase',
        padding: '10px 4px 6px',
      }}>
        Ejecuciones
      </div>

      {runs.length === 0 && (
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--color-text-tertiary)',
          padding: '8px 4px',
        }}>
          Sin ejecuciones aún
        </div>
      )}

      {runs.map(run => (
        <button
          key={run.id}
          onClick={() => onSelect(run)}
          style={{
            padding: '10px 12px',
            border: `1px solid ${run.id === currentRunId ? 'var(--color-brand-600, #1a8a1a)' : 'var(--color-border-primary)'}`,
            borderRadius: 5,
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: run.id === currentRunId ? 'var(--color-brand-50, rgba(26,138,26,0.08))' : 'var(--color-bg-primary)',
            textAlign: 'left',
            width: '100%',
            transition: 'all 0.12s',
          }}
        >
          <span style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            flexShrink: 0,
            background: STATUS_COLOR[run.status],
            boxShadow: run.status === 'running' ? `0 0 6px ${STATUS_COLOR[run.status]}` : undefined,
          }} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: 'var(--color-text-primary)',
            }}>
              {run.bot_icon} {run.bot_name}
            </div>
            <div style={{ color: 'var(--color-text-tertiary)', fontSize: 10, marginTop: 2 }}>
              {run.orders} pedidos · {formatTime(run.started_at)}
            </div>
          </span>
          <Badge label={run.status} color={STATUS_BADGE[run.status]} size="sm" />
        </button>
      ))}
    </>
  )
}
