import crypto from 'crypto'

// AES-256-GCM symmetric encryption for OAuth tokens at rest.
// ENCRYPTION_KEY must be a 64-char hex string (32 bytes). Generate with:
//   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
// Payload format (single string column): base64(iv):base64(authTag):base64(ciphertext)

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12 // GCM standard nonce length

function getKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY
  if (!hex || hex.length !== 64) {
    throw new Error(
      'ENCRYPTION_KEY must be set to a 64-character hex string (32 bytes)'
    )
  }
  return Buffer.from(hex, 'hex')
}

export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return [
    iv.toString('base64'),
    authTag.toString('base64'),
    encrypted.toString('base64'),
  ].join(':')
}

export function decrypt(payload: string): string {
  const [ivB64, tagB64, dataB64] = payload.split(':')
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error('Invalid encrypted payload format')
  }
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivB64, 'base64'))
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'))
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataB64, 'base64')),
    decipher.final(),
  ])
  return decrypted.toString('utf8')
}
