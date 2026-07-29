import { z } from 'zod'

export const campaignCategorySchema = z.enum([
  'geral',
  'musica',
  'games',
  'entretenimento',
  'esportes',
  'educacao',
  'estilo_de_vida',
  'tecnologia',
])

export const campaignContentTypeSchema = z.enum(['clipping', 'ugc'])

export const campaignDurationDaysSchema = z.union([z.literal(7), z.literal(20), z.literal(30)])

// 'fechada_agencia' only makes sense for agências of kind 'clipadores' (only
// members of that agency's roster can join) — validated in the create route
// against the agency's real `kind`, since a zod default alone can't express
// "conditional on another row".
export const campaignVisibilitySchema = z.enum(['aberta', 'fechada_agencia'])

const baseCampaignFields = {
  agency_profile_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  rules: z.string().max(5000).optional(),
  required_hashtag: z.string().min(1).max(100),
  category: campaignCategorySchema.default('geral'),
  content_type: campaignContentTypeSchema.default('clipping'),
  cover_image_url: z.string().url().optional(),
  badge_label: z.string().min(1).max(50).default('Campanha'),
  duration_days: campaignDurationDaysSchema,
  visibility: campaignVisibilitySchema.default('aberta'),
}

export const createCampaignSchema = z.discriminatedUnion('modality', [
  z.object({
    modality: z.literal('cpm'),
    cpm_rate: z.number().positive(),
    budget_total: z.number().positive(),
    ...baseCampaignFields,
  }),
  z.object({
    modality: z.literal('leaderboard'),
    prize_structure: z
      .array(
        z.object({
          position: z.number().int().positive(),
          amount: z.number().positive(),
        })
      )
      .min(1),
    ranking_metric: z.string().min(1).default('views'),
    ...baseCampaignFields,
  }),
])

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>

export const campaignsListQuerySchema = z.object({
  category: campaignCategorySchema.optional(),
  content_type: campaignContentTypeSchema.optional(),
})

export const removePostSchema = z.object({
  reason: z.string().max(500).optional(),
})
