'use client'

import { useOnboarding } from '@/hooks/useOnboarding'
import { SetupWizard } from './SetupWizard'
import { ProductTour } from './ProductTour'
import { OnboardingChecklist } from './OnboardingChecklist'

// Decides which onboarding layer (if any) is visible. Veteran users with
// everything completed render nothing — a clean experience.
export function OnboardingLayers() {
  const { showWizard, showTour, showChecklist } = useOnboarding()

  return (
    <>
      {showWizard && <SetupWizard />}
      {showTour && !showWizard && <ProductTour />}
      {showChecklist && <OnboardingChecklist />}
    </>
  )
}
