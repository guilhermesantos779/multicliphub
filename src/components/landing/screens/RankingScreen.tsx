const ENTRIES = [
  { pos: 1, name: 'ClipLord', score: '14.7M', you: false },
  { pos: 2, name: 'KingRafa', score: '8.2M',  you: false },
  { pos: 3, name: 'ZeroNine',score: '6.1M',  you: false },
  { pos: 4, name: 'FluxClip',score: '4.9M',  you: false },
  { pos: 8, name: 'Você',     score: '1.2M',  you: true  },
]

const MEDALS = ['🥇', '🥈', '🥉']

const PODIUM_ORDER = [ENTRIES[1]!, ENTRIES[0]!, ENTRIES[2]!] // 2nd, 1st, 3rd

export function RankingScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#050505' }}>

      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a', flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#FAFAFA', letterSpacing: '-0.02em' }}>Ranking</span>
        <span style={{ fontSize: 9, color: '#f59e0b', background: 'rgba(245,158,11,0.10)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>👑 Kings of Reach</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Podium — top 3 */}
        <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '14px', flexShrink: 0 }}>
          <div style={{ fontSize: 9, color: '#888888', marginBottom: 12, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Top 3 do Mês</div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 12 }}>
            {PODIUM_ORDER.map((entry, i) => {
              const isCenter = i === 1 // center is 1st place
              const heights = [50, 66, 44] // 2nd, 1st, 3rd
              return (
                <div key={entry.pos} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  {isCenter && (
                    <span style={{ fontSize: 14 }}>👑</span>
                  )}
                  <div style={{
                    width: isCenter ? 40 : 34,
                    height: isCenter ? 40 : 34,
                    borderRadius: '50%',
                    background: isCenter
                      ? 'linear-gradient(135deg, #9146FF, #00E5A0)'
                      : 'rgba(255,255,255,0.08)',
                    border: isCenter ? '2px solid #9146FF' : '1px solid rgba(255,255,255,0.10)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: isCenter ? 11 : 9, fontWeight: 700, color: '#FAFAFA',
                  }}>
                    {entry.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: isCenter ? 10 : 9, fontWeight: 600, color: isCenter ? '#FAFAFA' : '#888', marginBottom: 1 }}>{entry.name}</div>
                    <div style={{ fontSize: 8, color: isCenter ? '#9146FF' : '#555' }}>{entry.score}</div>
                  </div>
                  {/* Podium column */}
                  <div style={{
                    width: isCenter ? 52 : 44,
                    height: heights[i],
                    background: isCenter
                      ? 'linear-gradient(to top, rgba(145,70,255,0.3), rgba(145,70,255,0.08))'
                      : 'rgba(255,255,255,0.04)',
                    borderRadius: '6px 6px 0 0',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 4,
                    fontSize: 10, color: '#888888',
                  }}>
                    {entry.pos}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Leaderboard list */}
        <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '10px 12px', flex: 1, overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ENTRIES.map((entry) => (
              <div
                key={entry.pos}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 8px',
                  borderRadius: 6,
                  background: entry.you ? 'rgba(145,70,255,0.08)' : 'transparent',
                  border: entry.you ? '1px solid rgba(145,70,255,0.15)' : '1px solid transparent',
                }}
              >
                <span style={{ fontSize: 12, width: 20, textAlign: 'center', flexShrink: 0 }}>
                  {entry.pos <= 3 ? MEDALS[entry.pos - 1] : entry.pos}
                </span>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: entry.you
                    ? 'linear-gradient(135deg, #9146FF, #00E5A0)'
                    : 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 8, fontWeight: 700, color: '#FAFAFA', flexShrink: 0,
                }}>
                  {entry.name.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 10, color: entry.you ? '#9146FF' : '#FAFAFA', fontWeight: entry.you ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                    {entry.you ? `${entry.name} (você)` : entry.name}
                  </span>
                </div>
                <span style={{ fontSize: 10, color: '#888888', fontWeight: 600, flexShrink: 0 }}>{entry.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
