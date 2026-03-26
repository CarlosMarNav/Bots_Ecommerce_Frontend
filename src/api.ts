import type { Bot, Run, RunLogsResponse } from './types'

const API = ''

export async function fetchBots(): Promise<Bot[]> {
  const res = await fetch(`${API}/api/bots`)
  return res.json()
}

export async function fetchRuns(): Promise<Run[]> {
  const res = await fetch(`${API}/api/runs`)
  return res.json()
}

export async function fetchRun(runId: string): Promise<Run> {
  const res = await fetch(`${API}/api/runs/${runId}`)
  return res.json()
}

export async function fetchLogs(runId: string, offset = 0): Promise<RunLogsResponse> {
  const res = await fetch(`${API}/api/runs/${runId}/logs?offset=${offset}`)
  return res.json()
}

export async function startRun(botId: string, orders: number, headless: boolean): Promise<{ run_id: string }> {
  const res = await fetch(`${API}/api/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bot_id: botId, orders, headless }),
  })
  return res.json()
}

export async function stopRun(runId: string): Promise<void> {
  await fetch(`${API}/api/run/${runId}/stop`, { method: 'POST' })
}
