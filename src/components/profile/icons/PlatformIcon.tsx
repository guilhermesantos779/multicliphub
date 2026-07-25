import type { ProfilePlatform } from '@/lib/profile'

interface PlatformIconProps {
  platform: ProfilePlatform
  size?: number
  className?: string
}

// Inline brand glyphs (lucide-react 1.x dropped brand icons). Single-path
// where possible; currentColor so callers control the tint.
export function PlatformIcon({ platform, size = 18, className }: PlatformIconProps) {
  const common = { width: size, height: size, className, 'aria-hidden': true } as const

  switch (platform) {
    case 'tiktok':
      return (
        <svg {...common} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .59.04.86.13V9.4a6.33 6.33 0 0 0-1-.05A6.34 6.34 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.12z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      )
    case 'youtube':
      return (
        <svg {...common} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    case 'twitch':
      return (
        <svg {...common} viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.149 0l-1.612 4.119v16.836h5.731v3.045h3.224l3.045-3.045h4.657l6.269-6.269V0H2.149zm19.164 13.612l-3.582 3.582h-5.731l-3.045 3.045v-3.045H4.119V2.149h17.194v11.463zM15.851 5.731v6.269h2.149V5.731h-2.149zm-5.731 0v6.269h2.149V5.731h-2.149z" />
        </svg>
      )
    case 'kick':
      return (
        <svg {...common} viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3h6v5.4L13.2 3h7.2l-6 8.4 6 9.6h-7.2L9 15.6V21H3V3z" />
        </svg>
      )
    case 'twitter':
      return (
        <svg {...common} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
  }
}
