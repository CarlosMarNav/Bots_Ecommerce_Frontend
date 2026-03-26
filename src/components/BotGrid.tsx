import { Card } from 'sendingbay-ui'
import type { Bot } from '../types'

interface Props {
  bots: Bot[]
  selectedBot: string | null
  onSelect: (id: string) => void
}

export default function BotGrid({ bots, selectedBot, onSelect }: Props) {
  return (
    <div style={{ padding: '24px 24px 0' }}>
      <SectionTitle>Seleccionar Bot</SectionTitle>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 10,
        marginTop: 12,
      }}>
        {bots.map(bot => (
          <button
            key={bot.id}
            onClick={() => bot.available && onSelect(bot.id)}
            disabled={!bot.available}
            style={{
              border: `1px solid ${selectedBot === bot.id ? bot.color : 'var(--color-border-primary)'}`,
              borderRadius: 6,
              padding: '16px 12px',
              cursor: bot.available ? 'pointer' : 'not-allowed',
              background: selectedBot === bot.id
                ? 'var(--color-bg-secondary)'
                : 'var(--color-bg-primary)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              opacity: bot.available ? 1 : 0.35,
              transition: 'all 0.15s ease',
              width: '100%',
            }}
          >
            {/* Color accent bar at bottom */}
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: 2,
              background: bot.color,
              opacity: selectedBot === bot.id ? 1 : 0,
              transition: 'opacity 0.15s',
            }} />

            {/* Checkmark */}
            <div style={{
              position: 'absolute',
              top: 8, right: 8,
              width: 16, height: 16,
              borderRadius: '50%',
              border: `1px solid ${selectedBot === bot.id ? bot.color : 'var(--color-border-primary)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              background: selectedBot === bot.id ? bot.color : 'transparent',
              color: selectedBot === bot.id ? '#fff' : 'transparent',
              transition: 'all 0.15s',
            }}>
              ✓
            </div>

            <div style={{ fontSize: 26, marginBottom: 8 }}>{bot.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: 0.3 }}>
              {bot.name}
            </div>
            {!bot.available && (
              <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                NO ENCONTRADO
              </div>
            )}
          </button>
        ))}
      </div>
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
