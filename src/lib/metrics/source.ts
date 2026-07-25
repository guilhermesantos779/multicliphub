// Central switch for metric source. Today = 'posts'. When the OAuth platform
// integrations go live, flip ACTIVE_METRIC_SOURCE to 'views' and fill
// daily_activity / platform_rankings with source='views' — the UI components
// read everything from here, so no component changes are needed.
export type MetricSource = 'posts' | 'views'

export const ACTIVE_METRIC_SOURCE: MetricSource = 'posts'

export const SOURCE_LABELS: Record<MetricSource, {
  unit: string
  heatmapLegend: string
  rankingMetric: string
}> = {
  posts: {
    unit: 'posts',
    heatmapLegend: 'Posts publicados',
    rankingMetric: 'Posts no mês',
  },
  views: {
    unit: 'views',
    heatmapLegend: 'Views acumulados',
    rankingMetric: 'Views no mês',
  },
}
