import type { SupabaseClient } from '@supabase/supabase-js'
import {
  TICKET_ATTACH_BUCKET, MAX_ATTACH_SIZE, ALLOWED_MIME,
} from '@/lib/support'

export function validateImage(file: File): string | null {
  if (!ALLOWED_MIME.includes(file.type)) return 'Tipo de arquivo não suportado (use PNG, JPG, WebP ou GIF).'
  if (file.size > MAX_ATTACH_SIZE) return 'Imagem maior que 5MB.'
  return null
}

export interface UploadedAttachment {
  file_url: string // storage path
  file_name: string
  file_size: number
  mime_type: string
}

// Uploads images into {ticketId}/{uid}/... and returns metadata rows.
export async function uploadTicketImages(
  supabase: SupabaseClient,
  ticketId: string,
  uid: string,
  files: File[],
): Promise<UploadedAttachment[]> {
  const out: UploadedAttachment[] = []
  for (const file of files) {
    const ext = file.name.split('.').pop() || 'png'
    const path = `${ticketId}/${uid}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage
      .from(TICKET_ATTACH_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false })
    if (error) throw error
    out.push({
      file_url: path,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
    })
  }
  return out
}
