import { useEffect, useRef, useState, useCallback } from 'react'
import type { Bot, Run, LogEntry } from './types'
import { fetchBots, fetchRuns, fetchRun, fetchLogs, startRun, stopRun } from './api'
import AppHeader from './components/AppHeader'
import RunSidebar from './components/RunSidebar'
import BotGrid from './components/BotGrid'
import LaunchPanel from './components/LaunchPanel'
import TerminalView from './components/TerminalView'
import ToastContainer from './components/ToastContainer'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

export default function App() {
  const [bots, setBots] = useState<Bot[]>([])
  const [runs, setRuns] = useState<Run[]>([])
  const [selectedBot, setSelectedBot] = useState<string | null>(null)
  const [currentRun, setCurrentRun] = useState<Run | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [orders, setOrders] = useState(10)
  const [launching, setLaunching] = useState(false)
  const [activeCount, setActiveCount] = useState(0)
  const [toasts, setToasts] = useState<Toast[]>([])

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const logOffsetRef = useRef(0)
  const toastIdRef = useRef(0)

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = ++toastIdRef.current
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  // Load bots on mount
  useEffect(() => {
    fetchBots()
      .then(setBots)
      .catch(() => showToast('Error conectando con el servidor', 'error'))
  }, [showToast])

  // Poll runs every 3s
  useEffect(() => {
    const load = () =>
      fetchRuns()
        .then(data => {
          const sorted = [...data].reverse()
          setRuns(sorted)
          setActiveCount(data.filter(r => r.status === 'running').length)
        })
        .catch(() => {})

    load()
    const interval = setInterval(load, 3000)
    return () => clearInterval(interval)
  }, [])

  const stopPoll = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  const startPoll = useCallback((runId: string) => {
    stopPoll()
    pollRef.current = setInterval(async () => {
      try {
        const data = await fetchLogs(runId, logOffsetRef.current)
        if (data.logs.length > 0) {
          setLogs(prev => [...prev, ...data.logs])
          logOffsetRef.current += data.logs.length
        }
        if (data.status !== 'running') {
          stopPoll()
          const run = await fetchRun(runId)
          setCurrentRun(run)
          setRuns(prev => prev.map(r => r.id === runId ? run : r))
        }
      } catch (_) {}
    }, 800)
  }, [stopPoll])

  const viewRun = useCallback(async (run: Run) => {
    stopPoll()
    logOffsetRef.current = 0
    setLogs([])
    setCurrentRun(run)

    const data = await fetchLogs(run.id)
    setLogs(data.logs)
    logOffsetRef.current = data.logs.length

    if (run.status === 'running') {
      startPoll(run.id)
    }
  }, [stopPoll, startPoll])

  const handleLaunch = async () => {
    if (!selectedBot) return
    setLaunching(true)
    try {
      const { run_id } = await startRun(selectedBot, orders, true)
      showToast(`Bot iniciado — ID: ${run_id}`, 'success')
      const run = await fetchRun(run_id)
      setRuns(prev => [run, ...prev])
      viewRun(run)
    } catch (_) {
      showToast('Error al iniciar el bot', 'error')
    } finally {
      setLaunching(false)
    }
  }

  const handleStop = async () => {
    if (!currentRun) return
    await stopRun(currentRun.id)
    stopPoll()
    showToast('Bot detenido', 'info')
    setCurrentRun(prev => prev ? { ...prev, status: 'stopped' } : prev)
  }

  return (
    <>
      <div className="app-layout">
        <div className="app-header">
          <AppHeader activeCount={activeCount} />
        </div>

        <aside className="app-sidebar">
          <RunSidebar runs={runs} currentRunId={currentRun?.id ?? null} onSelect={viewRun} />
        </aside>

        <main className="app-main">
          <BotGrid
            bots={bots}
            selectedBot={selectedBot}
            onSelect={setSelectedBot}
          />
          <LaunchPanel
            orders={orders}
            onOrdersChange={setOrders}
            onLaunch={handleLaunch}
            disabled={!selectedBot || launching}
            launching={launching}
            selectedBotColor={bots.find(b => b.id === selectedBot)?.color}
          />
          <TerminalView
            run={currentRun}
            logs={logs}
            onStop={handleStop}
            onClear={() => setLogs([])}
          />
        </main>
      </div>

      <ToastContainer toasts={toasts} />
    </>
  )
}
