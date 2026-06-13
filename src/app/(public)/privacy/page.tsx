import { permanentRedirect } from 'next/navigation'

// Canonical privacy policy now lives at the PT URL /privacidade.
// Keep this route as a permanent redirect so previously-registered links
// (Meta/Google/TikTok dashboards, old bookmarks) still resolve.
export default function PrivacyRedirect() {
  permanentRedirect('/privacidade')
}
