import { Metadata } from 'next'
import { Topbar } from '@/components/dashboard/Topbar'
import { CampanhasContent } from '@/components/campanhas/CampanhasContent'

export const metadata: Metadata = {
  title: 'Campanhas — MultiClipHub',
}

export default function CampanhasPage() {
  return (
    <div>
      <Topbar title="Campanhas" />
      <CampanhasContent />
    </div>
  )
}
