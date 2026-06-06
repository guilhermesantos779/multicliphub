'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import { cn, formatViews } from '@/lib/utils'
import { RankAvatar } from './RankAvatar'

export interface RankEntry {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  plan: string | null
  score: number
}

// Medal palette per the spec — gold / silver / bronze.
const MEDAL = {
  1: { color: '#FFD700', glow: 'rgba(255,215,0,0.45)', label: '1º' },
  2: { color: '#C0C0C0', glow: 'rgba(192,192,192,0.35)', label: '2º' },
  3: { color: '#CD7F32', glow: 'rgba(205,127,50,0.35)', label: '3º' },
} as const

interface PodiumProps {
  top3: RankEntry[]
  myId?: string
  unit: string // 'views' | 'posts'
}

function Spot({ entry, pos, myId, unit }: { entry: RankEntry; pos: 1 | 2 | 3; myId?: string; unit: string }) {
  const medal = MEDAL[pos]
  const isMe = entry.id === myId
  const first = pos === 1
  const avatarSize = first ? 88 : 64
  const pedestalH = first ? 'h-24' : pos === 2 ? 'h-16' : 'h-12'
  const displayName = entry.full_name?.split(' ')[0] || (entry.username ? `@${entry.username}` : 'Anônimo')

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: pos === 1 ? 0.1 : pos === 2 ? 0.25 : 0.4, type: 'spring', stiffness: 200, damping: 22 }}
      className={cn('flex flex-col items-center', first ? 'w-[40%] max-w-[180px]' : 'w-[30%] max-w-[150px]')}
    >
      {/* Crown — champion only */}
      {first && (
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-1"
        >
          <Crown size={26} className="fill-[#FFD700] text-[#FFD700]" style={{ filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.7))' }} />
        </motion.div>
      )}

      {/* Avatar with plan frame + medal glow */}
      <div className="relative" style={{ filter: `drop-shadow(0 0 ${first ? 16 : 8}px ${medal.glow})` }}>
        <RankAvatar
          fullName={entry.full_name}
          username={entry.username}
          avatarUrl={entry.avatar_url}
          plan={entry.plan}
          size={avatarSize}
          variant={first ? 'full' : 'compact'}
        />
        {/* Medal badge */}
        <span
          className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold text-black"
          style={{ background: medal.color, boxShadow: `0 0 8px ${medal.glow}` }}
        >
          {pos}
        </span>
      </div>

      {/* Name + score */}
      <div className="mt-3 w-full text-center">
        {entry.username ? (
          <Link href={`/perfil/${entry.username}`} className="block truncate text-[13px] font-semibold text-white transition-colors hover:text-[#9146FF]">
            {displayName}
          </Link>
        ) : (
          <div className="truncate text-[13px] font-semibold text-white">{displayName}</div>
        )}
        <div className="text-[11px]" style={{ color: medal.color }}>
          {formatViews(entry.score)} {unit}
        </div>
        {isMe && <div className="mt-0.5 text-[10px] font-medium text-[#9146FF]">Você</div>}
      </div>

      {/* Pedestal */}
      <div
        className={cn('mt-3 flex w-full items-start justify-center rounded-t-xl pt-2', pedestalH)}
        style={{
          background: `linear-gradient(to top, ${medal.color}10, ${medal.color}33)`,
          border: `1px solid ${medal.color}40`,
          borderBottom: 'none',
        }}
      >
        <span className="text-[20px] font-black" style={{ color: medal.color, textShadow: `0 0 12px ${medal.glow}` }}>
          {pos}
        </span>
      </div>
    </motion.div>
  )
}

export function Podium({ top3, myId, unit }: PodiumProps) {
  const first = top3[0]
  const second = top3[1]
  const third = top3[2]

  return (
    <div className="relative">
      {/* Soft champion glow behind the podium */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-40 w-[70%] -translate-x-1/2"
        style={{ background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.10) 0%, transparent 70%)', filter: 'blur(30px)' }}
      />
      <div className="relative flex items-end justify-center gap-2 sm:gap-4">
        {second && <Spot entry={second} pos={2} myId={myId} unit={unit} />}
        {first && <Spot entry={first} pos={1} myId={myId} unit={unit} />}
        {third && <Spot entry={third} pos={3} myId={myId} unit={unit} />}
      </div>
    </div>
  )
}
