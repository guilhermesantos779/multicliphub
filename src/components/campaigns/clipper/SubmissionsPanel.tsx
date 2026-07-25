import type { CampaignSubmission } from '@/types/campaigns-clipper.types'
import { formatViews, formatDate } from '@/lib/utils'
import { HashtagBadge } from './HashtagBadge'

const PLATFORM_LABELS: Record<CampaignSubmission['platform'], string> = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  youtube: 'YouTube',
  kwai: 'Kwai',
}

interface SubmissionsPanelProps {
  hashtag: string
  submissions: CampaignSubmission[]
}

export function SubmissionsPanel({ hashtag, submissions }: SubmissionsPanelProps) {
  return (
    <div className="space-y-4">
      <HashtagBadge hashtag={hashtag} />

      <div className="rounded-xl border border-white/[0.06] bg-[#111111]">
        <div className="border-b border-white/[0.06] px-5 py-4">
          <h3 className="text-[14px] font-semibold text-white">Posts detectados automaticamente</h3>
          <p className="mt-0.5 text-[12px] text-[#666666]">
            Detectamos seus posts publicados com a hashtag acima — não é necessário colar links.
          </p>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {submissions.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="mb-2 text-3xl">🔎</div>
              <div className="text-[13px] font-medium text-white">Nenhum post detectado ainda</div>
              <div className="mt-1 max-w-xs text-[12px] text-[#444444]">
                Publique usando a hashtag {hashtag} e ele aparece aqui automaticamente.
              </div>
            </div>
          ) : (
            submissions.map(submission => (
              <a
                key={submission.id}
                href={submission.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.03]"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-[11px] font-semibold text-[#888888]">
                  {PLATFORM_LABELS[submission.platform].slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] text-white">{PLATFORM_LABELS[submission.platform]}</div>
                  <div className="text-[11px] text-[#555555]">Detectado em {formatDate(submission.detectedAt)}</div>
                </div>
                <div className="shrink-0 text-[12px] font-semibold text-[#00E5A0]">
                  {formatViews(submission.views)} views
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
