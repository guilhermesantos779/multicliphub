'use client'
import { FilterDropdown } from './FilterDropdown'
import { CATEGORY_LABELS, CONTENT_TYPE_LABELS } from '@/lib/campaigns/labels'
import type { CampaignCategory, CampaignContentType } from '@/types/campaigns.types'

export type CategoryFilterValue = CampaignCategory | 'all'
export type ContentTypeFilterValue = CampaignContentType | 'all'

interface CampaignFiltersProps {
  category: CategoryFilterValue
  onCategoryChange: (value: CategoryFilterValue) => void
  contentType: ContentTypeFilterValue
  onContentTypeChange: (value: ContentTypeFilterValue) => void
}

const CATEGORY_OPTIONS: { value: CategoryFilterValue; label: string }[] = [
  { value: 'all', label: 'Todas as categorias' },
  ...(Object.keys(CATEGORY_LABELS) as CampaignCategory[]).map(key => ({
    value: key,
    label: CATEGORY_LABELS[key],
  })),
]

const CONTENT_TYPE_OPTIONS: { value: ContentTypeFilterValue; label: string }[] = [
  { value: 'all', label: 'Todos os tipos' },
  ...(Object.keys(CONTENT_TYPE_LABELS) as CampaignContentType[]).map(key => ({
    value: key,
    label: CONTENT_TYPE_LABELS[key],
  })),
]

export function CampaignFilters({
  category,
  onCategoryChange,
  contentType,
  onContentTypeChange,
}: CampaignFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <FilterDropdown options={CATEGORY_OPTIONS} value={category} onChange={onCategoryChange} />
      <FilterDropdown options={CONTENT_TYPE_OPTIONS} value={contentType} onChange={onContentTypeChange} />
    </div>
  )
}
