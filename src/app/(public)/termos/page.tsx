import type { Metadata } from 'next'
import { TermosPageClient } from '@/components/terms/TermosPageClient'

export const metadata: Metadata = {
  title: 'Termos de Uso — MultiClip Hub',
  description: 'Termos e condições de uso do MultiClip Hub.',
}

export default function TermosPage() {
  return <TermosPageClient />
}
