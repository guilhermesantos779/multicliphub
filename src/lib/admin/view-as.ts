// Shared with src/proxy.ts (edge middleware) — kept import-free so it's
// safe to pull into the edge bundle without dragging in next/headers etc.
export const VIEW_AS_COOKIE = 'mch_view_as'
export type ViewAsMode = 'clipper' | 'agency'
