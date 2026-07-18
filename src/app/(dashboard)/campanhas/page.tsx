'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Topbar } from '@/components/dashboard/Topbar'
import { RoleSelectHero } from '@/components/campaigns/clipper/RoleSelectHero'
import {
  CampaignFilters,
  type CategoryFilterValue,
  type ContentTypeFilterValue,
} from '@/components/campaigns/clipper/CampaignFilters'
import { CampaignCard } from '@/components/campaigns/CampaignCard'
import { fetchCampaigns, fetchHasAgencyProfile } from '@/lib/mocks/campaigns'
import type { Campaign } from '@/types/campaigns.types'

const ENTERED_STORAGE_KEY = 'mch:campanhas:entered'

export default function CampanhasPage() {
  const [checkingRole, setCheckingRole] = useState(true)
  const [entered, setEntered] = useState(
    () => typeof window !== 'undefined' && window.localStorage.getItem(ENTERED_STORAGE_KEY) === 'true'
  )
  const [hasAgencyProfile, setHasAgencyProfile] = useState(false)

  const [category, setCategory] = useState<CategoryFilterValue>('all')
  const [contentType, setContentType] = useState<ContentTypeFilterValue>('all')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loadingCampaigns, setLoadingCampaigns] = useState(true)

  useEffect(() => {
    // TODO: substituir por chamada real quando merged (agency_profile do Agente 1/2)
    fetchHasAgencyProfile().then(value => {
      setHasAgencyProfile(value)
      setCheckingRole(false)
    })
  }, [])

  useEffect(() => {
    async function run() {
      setLoadingCampaigns(true)
      const data = await fetchCampaigns({ category, contentType })
      setCampaigns(data)
      setLoadingCampaigns(false)
    }
    run()
  }, [category, contentType])

  const handleChooseClipper = () => {
    window.localStorage.setItem(ENTERED_STORAGE_KEY, 'true')
    setEntered(true)
  }

  const showHero = !checkingRole && !entered && !hasAgencyProfile

  return (
    <div>
      <Topbar title="Campanhas" />

      <div className="p-6">
        {checkingRole ? null : showHero ? (
          <RoleSelectHero onChooseClipper={handleChooseClipper} />
        ) : (
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
        )}
      </div>
    </div>
  )
}
