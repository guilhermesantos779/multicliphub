'use client'
import { useContext } from 'react'
import { OnboardingContext } from '@/components/onboarding/OnboardingProvider'

/**
 * Reads onboarding state + actions from OnboardingProvider.
 * Safe to call anywhere under the dashboard layout (returns no-op defaults
 * if the provider is somehow absent).
 */
export function useOnboarding() {
  return useContext(OnboardingContext)
}
