// src/lib/schemas/index.ts
// Centralized zod schemas for API input validation, plus a parseBody helper.
import { z } from 'zod'

// ── Auth & User ──────────────────────────────────────────────
export const usernameSchema = z
  .string()
  .min(3, 'Mínimo 3 caracteres')
  .max(20, 'Máximo 20 caracteres')
  .regex(/^[a-z0-9_-]+$/, 'Apenas letras minúsculas, números, _ e -')

export const checkUsernameSchema = z.object({
  username: usernameSchema,
})

// ── Tickets ──────────────────────────────────────────────────
export const createTicketSchema = z.object({
  subject: z.string().min(5, 'Assunto muito curto').max(120, 'Máximo 120 caracteres'),
  category: z.enum(['bug', 'duvida', 'pagamento', 'sugestao']),
  message: z.string().min(10, 'Mensagem muito curta').max(2000, 'Máximo 2000 caracteres').optional(),
})

export const updateTicketStatusSchema = z.object({
  status: z.enum(['aberto', 'em_analise', 'aguardando_usuario', 'resolvido', 'fechado']),
  admin_message: z.string().max(500).optional(),
})

// ── Stripe ───────────────────────────────────────────────────
export const checkoutSchema = z.object({
  plan: z.enum(['clipper', 'pro', 'king']),
  billing: z.enum(['monthly', 'annual']),
})

// ── Upload / Publications ────────────────────────────────────
export const createPublicationSchema = z.object({
  title: z.string().min(1, 'Título obrigatório').max(200, 'Máximo 200 caracteres'),
  caption: z.string().max(5000, 'Máximo 5000 caracteres').optional().default(''),
  hashtags: z.array(z.string().max(100)).max(30, 'Máximo 30 hashtags').optional().default([]),
  platforms: z.array(z.enum(['tiktok', 'instagram', 'youtube'])).min(1, 'Selecione ao menos uma plataforma'),
  thumbnail: z.string().optional(),
  location: z.string().max(100).optional(),
  collab_tags: z.array(z.string()).max(3).optional(),
  tiktok_options: z.object({
    privacy_level: z.enum([
      'PUBLIC_TO_EVERYONE',
      'MUTUAL_FOLLOW_FRIENDS',
      'FOLLOWER_OF_CREATOR',
      'SELF_ONLY',
    ]).default('PUBLIC_TO_EVERYONE'),
    comment_disabled: z.boolean().default(false),
    duet_disabled: z.boolean().default(false),
    stitch_disabled: z.boolean().default(false),
    brand_content_toggle: z.boolean().default(false),
    brand_organic_toggle: z.boolean().default(false),
  }).optional(),
  youtube_options: z.object({
    category_id: z.string().default('20'),
    made_for_kids: z.boolean().default(false),
  }).optional(),
})

// ── Profile ──────────────────────────────────────────────────
export const updateProfileSchema = z.object({
  display_name: z.string().min(1).max(50).optional(),
  bio: z.string().max(160).optional(),
  website: z.string().url().optional().or(z.literal('')),
})

// ── Helper: parse a request body against a schema ────────────
export async function parseBody<T>(
  request: Request,
  schema: z.ZodType<T>
): Promise<
  | { success: true; data: T }
  | { success: false; error: Response }
> {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return {
      success: false,
      error: new Response(
        JSON.stringify({ error: 'JSON inválido no corpo da requisição' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      ),
    }
  }

  const result = schema.safeParse(raw)
  if (!result.success) {
    return {
      success: false,
      error: new Response(
        JSON.stringify({
          error: 'Dados inválidos',
          details: z.flattenError(result.error).fieldErrors,
        }),
        { status: 422, headers: { 'Content-Type': 'application/json' } }
      ),
    }
  }

  return { success: true, data: result.data }
}
