export interface Bot {
  id: string
  name: string
  path: string
  color: string
  icon: string
  available: boolean
}

export interface Run {
  id: string
  bot_id: string
  bot_name: string
  bot_icon: string
  bot_color: string
  status: 'running' | 'completed' | 'failed' | 'stopped'
  started_at: string
  ended_at?: string
  orders: number
  logs: LogEntry[]
}

export interface LogEntry {
  time: string
  text: string
  type: 'stdout' | 'error' | 'system'
}

export interface RunLogsResponse {
  logs: LogEntry[]
  status: Run['status']
}
