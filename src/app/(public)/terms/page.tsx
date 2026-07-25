import { permanentRedirect } from 'next/navigation'

// Canonical terms of use now live at the PT URL /termos.
// Keep this route as a permanent redirect so previously-registered links
// (Meta/Google/TikTok dashboards, old bookmarks) still resolve.
export default function TermsRedirect() {
  permanentRedirect('/termos')
}
