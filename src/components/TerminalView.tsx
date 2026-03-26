import { useEffect, useRef } from 'react'
import { Button, Badge } from 'sendingbay-ui'
import type { Run, LogEntry } from '../types'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AnsiUp from 'ansi_up'

const ansiUp = new AnsiUp()

interface Props {
  run: Run | null
  logs: LogEntry[]
  onStop: () => void
  onClear: () => void
}

const STATUS_COLOR: Record<Run['status'], 'success' | 'error' | 'warning' | 'gray'> = {
  running: 'success',
  completed: 'success',
  failed: 'error',
  stopped: 'warning',
}

function calcElapsed(start: string, end?: string) {
  const ms = new Date(end ?? new Date()).getTime() - new Date(start).getTime()
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

function getLogClass(log: LogEntry): string {
  const t = log.text.toLowerCase()
  if (log.type === 'system') return 'system'
  if (log.type === 'error' || t.includes('error') || t.includes('traceback') || t.includes('exception')) return 'error'
  if (t.includes('warn') || t.includes('warning')) return 'warn'
  return ''
}

export default function TerminalView({ run, logs, onStop, onClear }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div style={{ padding: '20px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionTitle>Terminal</SectionTitle>

      {run && (
        <div style={{
          display: 'flex',
          gap: 20,
          padding: '10px 14px',
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border-primary)',
          borderRadius: 5,
          flexWrap: 'wrap',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
        }}>
          <InfoField label="ID" value={run.id} />
          <InfoField label="BOT" value={`${run.bot_icon} ${run.bot_name}`} />
          <InfoField label="ORDERS" value={String(run.orders)} />
          <InfoField label="TIEMPO" value={calcElapsed(run.started_at, run.ended_at)} />
          <div style={{ flex: 1 }} />
          <Badge label={run.status.toUpperCase()} color={STATUS_COLOR[run.status]} size="sm" />
        </div>
      )}

      <div style={{
        flex: 1,
        border: '1px solid var(--color-border-primary)',
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minHeight: 280,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 14px',
          borderBottom: '1px solid var(--color-border-primary)',
          gap: 12,
          background: 'var(--color-bg-secondary)',
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28ca41' }} />
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--color-text-secondary)',
            flex: 1,
          }}>
            {run ? `${run.bot_icon} ${run.bot_name} — ${run.id}` : 'TERMINAL'}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            {run?.status === 'running' && (
              <Button size="sm" color="primary-destructive" onClick={onStop}>
                ■ STOP
              </Button>
            )}
            <Button size="sm" color="secondary" onClick={onClear}>
              CLR
            </Button>
          </div>
        </div>

        <div ref={bodyRef} className="terminal-body">
          {!run && logs.length === 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 220,
              color: 'var(--color-text-tertiary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              gap: 8,
              opacity: 0.5,
            }}>
              <div style={{ fontSize: 28 }}>⬛</div>
              <div>Selecciona una ejecución para ver los logs</div>
            </div>
          )}

          {logs.map((log, i) => (
            <div key={i} className="log-line">
              <span className="log-time">{log.time}</span>
              <span
                className={`log-text ${getLogClass(log)}`}
                dangerouslySetInnerHTML={{ __html: ansiUp.ansi_to_html(log.text) }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <span style={{ color: 'var(--color-text-tertiary)', letterSpacing: 1 }}>{label}</span>
      <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      letterSpacing: 3,
      color: 'var(--color-text-tertiary)',
      textTransform: 'uppercase',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    }}>
      {children}
      <div style={{ flex: 1, height: 1, background: 'var(--color-border-primary)' }} />
    </div>
  )
}
