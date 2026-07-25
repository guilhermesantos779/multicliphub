import {
  CATEGORY_META, STATUS_META, PRIORITY_META,
  type TicketCategory, type TicketStatus, type TicketPriority,
} from '@/lib/support'

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ color, background: `color-mix(in srgb, ${color} 14%, transparent)` }}
    >
      {label}
    </span>
  )
}

export function CategoryBadge({ category }: { category: string }) {
  const m = CATEGORY_META[category as TicketCategory]
  if (!m) return null
  return <Pill label={m.label} color={m.color} />
}

export function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status as TicketStatus]
  if (!m) return null
  return <Pill label={m.label} color={m.color} />
}

export function PriorityBadge({ priority }: { priority: string }) {
  const m = PRIORITY_META[priority as TicketPriority]
  if (!m) return null
  return <Pill label={m.label} color={m.color} />
}
