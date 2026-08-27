'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Topbar } from '@/components/dashboard/Topbar'
import {
  CampaignFilters,
  type CategoryFilterValue,
  type ContentTypeFilterValue,
} from '@/components/campaigns/clipper/CampaignFilters'
import { CampaignCard } from '@/components/campaigns/clipper/CampaignCard'
import type { Campaign } from '@/types/campaigns-clipper.types'

export default function CampanhasPage() {
  const [category, setCategory] = useState<CategoryFilterValue>('all')
  const [contentType, setContentType] = useState<ContentTypeFilterValue>('all')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loadingCampaigns, setLoadingCampaigns] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoadingCampaigns(true)
      const params = new URLSearchParams()
      if (category !== 'all') params.set('category', category)
      if (contentType !== 'all') params.set('content_type', contentType)
      const res = await fetch(`/api/campaigns?${params.toString()}`)
      const json = await res.json()
      if (!cancelled) {
        setCampaigns(json.campaigns ?? [])
        setLoadingCampaigns(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [category, contentType])

  return (
    <div>
      <Topbar title="Campanhas" />

      <div className="p-6">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-semibold text-white">Campanhas disponíveis</h2>
              <p className="mt-0.5 text-[12px] text-[#666666]">
                Encontre campanhas ativas e comece a postar com a hashtag exigida.
              </p>
            </div>
            <Link href="/agencia/onboarding" className="text-[12px] font-medium text-[#00E5A0] hover:underline">
              Quer criar campanhas? Comece o onboarding de agência →
            </Link>
          </div>

          <CampaignFilters
            category={category}
            onCategoryChange={setCategory}
            contentType={contentType}
            onContentTypeChange={setContentType}
          />

          {loadingCampaigns ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-xl border border-white/[0.06] bg-[#111111]" />
              ))}
            </div>
          ) : campaigns.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="mb-3 text-4xl">🔍</div>
              <div className="mb-1 text-[14px] font-medium text-white">Nenhuma campanha encontrada</div>
              <div className="text-[12px] text-[#444444]">Tente ajustar os filtros de categoria ou tipo de conteúdo.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {campaigns.map(campaign => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
