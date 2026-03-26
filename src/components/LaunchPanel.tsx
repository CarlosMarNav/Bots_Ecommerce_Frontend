import { Button, Input } from 'sendingbay-ui'

interface Props {
  orders: number
  onOrdersChange: (n: number) => void
  onLaunch: () => void
  disabled: boolean
  launching: boolean
  selectedBotColor?: string
}

export default function LaunchPanel({
  orders,
  onOrdersChange,
  onLaunch,
  disabled,
  launching,
  selectedBotColor,
}: Props) {
  return (
    <div style={{ padding: '20px 24px 0' }}>
      <SectionTitle>Configuración</SectionTitle>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 14,
        marginTop: 12,
        alignItems: 'flex-end',
      }}>
        <Input
          label="Número de pedidos"
          type="number"
          value={String(orders)}
          onChange={(val: string) => onOrdersChange(parseInt(val) || 1)}
        />

        <div style={selectedBotColor && !disabled ? {
          '--btn-override-bg': selectedBotColor,
        } as React.CSSProperties : {}}>
          <Button
            color="primary"
            onClick={onLaunch}
            isDisabled={disabled}
            isLoading={launching}
            showTextWhileLoading
          >
            {launching ? '⟳ INICIANDO...' : '▶ INICIAR BOT'}
          </Button>
        </div>
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
