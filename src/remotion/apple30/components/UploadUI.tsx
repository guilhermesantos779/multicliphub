import React from 'react'
import { Img, staticFile } from 'remotion'
import { C } from '../constants'

const NAV = [
  { icon: '⊞', label: 'Dashboard', active: false },
  { icon: '↑',  label: 'Upload',    active: true  },
  { icon: '🔗', label: 'Canais',    active: false },
  { icon: '📊', label: 'Analytics', active: false },
  { icon: '🏆', label: 'Ranking',   active: false },
]

interface UploadUIProps {
  publishProgress: number
}

export function UploadUI({ publishProgress }: UploadUIProps) {
  const tiktokDone  = publishProgress > 0.35
  const instaDone   = publishProgress > 0.65
  const youtubeDone = publishProgress > 0.90

  return (
    <div style={{ display: 'flex', height: 500 }}>

      {/* SIDEBAR */}
      <div
        style={{
          width: 200, flexShrink: 0,
          background: C.surface,
          borderRight: `0.5px solid ${C.border}`,
          padding: '18px 12px',
          display: 'flex', flexDirection: 'column', gap: 3,
        }}
      >
        <div style={{ padding: '4px 8px', marginBottom: 16 }}>
          <Img
            src={staticFile('logo.png')}
            style={{ height: 24, width: 'auto', objectFit: 'contain' }}
          />
        </div>

        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '9px 10px', borderRadius: 10,
            background: C.card, border: `0.5px solid ${C.border}`,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 26, height: 26, borderRadius: '50%',
              background: 'rgba(145,70,255,0.2)', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: C.purple,
              fontFamily: '"Sora", sans-serif',
            }}
          >G</div>
          <div>
            <div style={{ fontFamily: '"Sora", sans-serif', fontSize: 11, fontWeight: 600, color: C.white }}>
              Guilherme
            </div>
            <div style={{ fontFamily: '"Sora", sans-serif', fontSize: 9, color: C.mint, fontWeight: 500 }}>
              Plano King
            </div>
          </div>
        </div>

        {NAV.map(item => (
          <div
            key={item.label}
            style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '8px 10px', borderRadius: 7,
              background: item.active ? 'rgba(145,70,255,0.10)' : 'transparent',
              borderLeft: item.active ? `2px solid ${C.purple}` : '2px solid transparent',
              color: item.active ? C.white : 'rgba(255,255,255,0.30)',
              fontFamily: '"Sora", sans-serif',
              fontSize: 11, fontWeight: item.active ? 600 : 400,
            }}
          >
            <span style={{ fontSize: 12 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1, background: C.surface,
          padding: '20px 24px',
          display: 'flex', flexDirection: 'column', gap: 14,
          overflow: 'hidden',
        }}
      >
        {/* Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontFamily: '"Sora", sans-serif', fontSize: 15, fontWeight: 600, color: C.white }}>
            Upload & Publicar
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: C.card, border: `0.5px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, color: 'rgba(255,255,255,0.4)',
            }}>🔔</div>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'rgba(145,70,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: '"Sora", sans-serif',
              fontSize: 11, fontWeight: 700, color: C.purple,
            }}>G</div>
          </div>
        </div>

        {/* File ready card */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: C.card, border: `0.5px solid ${C.border}`,
          borderRadius: 12, padding: '14px 16px', flexShrink: 0,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(145,70,255,0.12)', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: C.purple, fontSize: 18,
          }}>▶</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: '"Sora", sans-serif', fontSize: 12, fontWeight: 600, color: C.white, marginBottom: 2 }}>
              clip_golaço_final.mp4
            </div>
            <div style={{ fontFamily: '"Sora", sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
              147 MB · 00:58 · 1080×1920
            </div>
          </div>
          <div style={{
            padding: '4px 12px', borderRadius: 99,
            background: 'rgba(0,229,160,0.08)',
            fontFamily: '"Sora", sans-serif',
            fontSize: 10, fontWeight: 600, color: C.mint,
          }}>Pronto</div>
        </div>

        {/* Platform cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, flexShrink: 0 }}>
          {[
            { label: 'TikTok',  icon: '♪', color: '#ffffff', done: tiktokDone  },
            { label: 'Reels',   icon: '◎', color: '#E1306C', done: instaDone   },
            { label: 'Shorts',  icon: '▶', color: '#FF0000', done: youtubeDone },
          ].map(p => (
            <div
              key={p.label}
              style={{
                background: p.done ? 'rgba(0,229,160,0.05)' : 'rgba(145,70,255,0.06)',
                border: p.done
                  ? `0.5px solid rgba(0,229,160,0.25)`
                  : `0.5px solid rgba(145,70,255,0.30)`,
                borderRadius: 12, padding: '16px 10px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 8,
              }}
            >
              <div style={{ fontSize: 22, color: p.color, filter: `drop-shadow(0 0 8px ${p.color}66)` }}>
                {p.icon}
              </div>
              <div style={{
                fontFamily: '"Sora", sans-serif', fontSize: 11,
                color: p.done ? C.mint : 'rgba(196,181,253,0.8)', fontWeight: 500,
              }}>{p.label}</div>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: p.done ? C.mint : C.purple,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, color: p.done ? '#000' : C.white, fontWeight: 700,
                boxShadow: p.done
                  ? `0 0 8px rgba(0,229,160,0.6)`
                  : `0 0 8px rgba(145,70,255,0.6)`,
              }}>
                {p.done ? '✓' : '↑'}
              </div>
            </div>
          ))}
        </div>

        {/* Publish status */}
        <div style={{
          background: C.card, border: `0.5px solid ${C.border}`,
          borderRadius: 12, padding: '16px 18px', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: '"Sora", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
              {publishProgress < 1 ? 'Publicando...' : 'Publicado com sucesso'}
            </span>
            <span style={{ fontFamily: '"Sora", sans-serif', fontSize: 11, fontWeight: 600, color: C.purple }}>
              {Math.round(publishProgress * 100)}%
            </span>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${publishProgress * 100}%`,
              background: `linear-gradient(90deg, ${C.purple}, ${C.mint})`,
              borderRadius: 99,
              boxShadow: `0 0 8px ${C.purple}`,
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}
