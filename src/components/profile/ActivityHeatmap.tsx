'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ACTIVE_METRIC_SOURCE, SOURCE_LABELS } from '@/lib/metrics/source'
import { formatDate } from '@/lib/utils'

interface ActivityHeatmapProps {
  userId: string
}

const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const DAY_LABELS: Record<number, string> = { 1: 'Seg', 3: 'Qua', 5: 'Sex' }

// 5-level brand scale: white → purple shades → mint peak
const LEVEL_COLORS = [
  'rgba(255,255,255,0.04)',
  'rgba(145,70,255,0.25)',
  'rgba(145,70,255,0.50)',
  'rgba(145,70,255,0.78)',
  '#00E5A0',
]

const CELL = 11
const GAP = 3
const STEP = CELL + GAP

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function buildWeeks() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(today)
  start.setDate(start.getDate() - 364)
  start.setDate(start.getDate() - start.getDay()) // back up to Sunday

  const weeks: Date[][] = []
  const cur = new Date(start)
  while (cur <= today) {
    const week: Date[] = []
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cur))
      cur.setDate(cur.getDate() + 1)
    }
    weeks.push(week)
  }
  return { weeks, today }
}

export function ActivityHeatmap({ userId }: ActivityHeatmapProps) {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loaded, setLoaded] = useState(false)
  const { weeks, today } = buildWeeks()
  const labels = SOURCE_LABELS[ACTIVE_METRIC_SOURCE]

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const supabase = createClient()
      const since = weeks[0]?.[0] ? dateKey(weeks[0][0]) : undefined
      let q = supabase
        .from('daily_activity')
        .select('activity_date, count')
        .eq('user_id', userId)
        .eq('source', ACTIVE_METRIC_SOURCE)
      if (since) q = q.gte('activity_date', since)
      const { data } = await q
      if (cancelled) return
      const map: Record<string, number> = {}
      for (const row of data ?? []) map[row.activity_date as string] = row.count as number
      setCounts(map)
      setLoaded(true)
    })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const maxCount = Math.max(0, ...Object.values(counts))
  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0)

  const levelOf = (count: number) => {
    if (count <= 0 || maxCount === 0) return 0
    return Math.min(4, Math.ceil((count / maxCount) * 4))
  }

  // Month labels at the first column of each new month
  const monthLabels: { col: number; text: string }[] = []
  let lastMonth = -1
  weeks.forEach((week, i) => {
    const m = week[0].getMonth()
    if (m !== lastMonth) {
      monthLabels.push({ col: i, text: MONTHS_PT[m] })
      lastMonth = m
    }
  })

  const gridWidth = weeks.length * STEP

  return (
    <section>
      <h2 className="mb-1 font-display text-[15px] font-semibold text-white">Atividade</h2>
      <p className="mb-4 text-[12px] text-white/40">{labels.heatmapLegend} · últimos 12 meses</p>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1" style={{ minWidth: gridWidth + 28 }}>
          {/* Day-of-week labels */}
          <div className="flex flex-col" style={{ gap: GAP, paddingTop: 16 }}>
            {Array.from({ length: 7 }).map((_, d) => (
              <div key={d} style={{ height: CELL }} className="flex items-center pr-1 text-[9px] leading-none text-white/40">
                {DAY_LABELS[d] ?? ''}
              </div>
            ))}
          </div>

          <div>
            {/* Month labels */}
            <div className="relative" style={{ height: 16, width: gridWidth }}>
              {monthLabels.map((m) => (
                <span
                  key={`${m.col}-${m.text}`}
                  className="absolute text-[9px] text-white/40"
                  style={{ left: m.col * STEP }}
                >
                  {m.text}
                </span>
              ))}
            </div>

            {/* Cells */}
            <div className="flex" style={{ gap: GAP }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                  {week.map((day, di) => {
                    const future = day > today
                    if (future) {
                      return <div key={di} style={{ width: CELL, height: CELL }} />
                    }
                    const key = dateKey(day)
                    const count = counts[key] ?? 0
                    const lvl = levelOf(count)
                    return (
                      <div
                        key={di}
                        title={`${count} ${labels.unit} · ${formatDate(key)}`}
                        style={{
                          width: CELL,
                          height: CELL,
                          borderRadius: 3,
                          background: LEVEL_COLORS[lvl],
                        }}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend + empty caption */}
      <div className="mt-3 flex items-center justify-between">
        {loaded && totalCount === 0 ? (
          <span className="text-[11px] text-white/40">
            Comece a publicar para preencher sua atividade
          </span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-1.5 text-[10px] text-white/40">
          <span>Menos</span>
          {LEVEL_COLORS.map((c, i) => (
            <span key={i} style={{ width: CELL, height: CELL, borderRadius: 3, background: c, display: 'inline-block' }} />
          ))}
          <span>Mais</span>
        </div>
      </div>
    </section>
  )
}
