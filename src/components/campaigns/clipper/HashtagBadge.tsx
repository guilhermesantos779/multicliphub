interface HashtagBadgeProps {
  hashtag: string
}

export function HashtagBadge({ hashtag }: HashtagBadgeProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#00E5A0]/25 bg-[#00E5A0]/[0.06] px-4 py-3">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <line x1="4" y1="9" x2="20" y2="9" />
        <line x1="4" y1="15" x2="20" y2="15" />
        <line x1="10" y1="3" x2="8" y2="21" />
        <line x1="16" y1="3" x2="14" y2="21" />
      </svg>
      <div>
        <div className="text-[10px] uppercase tracking-[0.05em] text-[#00E5A0]/70">Hashtag obrigatória</div>
        <div className="text-[16px] font-bold text-[#00E5A0]">{hashtag}</div>
      </div>
    </div>
  )
}
