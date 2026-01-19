import crypto from 'crypto';

export function decryptWithPassword(input: string, password: string): string {
  const parts = input.split(':');
  if (parts.length !== 5 || parts[0] !== 'v1') throw new Error('INVALID_SECRET_FORMAT');
  const salt = Buffer.from(parts[1], 'base64');
  const iv = Buffer.from(parts[2], 'base64');
  const ciphertext = Buffer.from(parts[3], 'base64');
  const tag = Buffer.from(parts[4], 'base64');
  const key = crypto.scryptSync(password, salt, 32);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const out = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return out.toString('utf8');
}

export function getPsnTokenFromEnv(): string | null {
  const plain = process.env.PSN_NPSSO || process.env.PSN_TOKEN || null;
  if (plain) return plain;
  const enc = process.env.PSN_TOKEN_ENC || null;
  const key = process.env.PSN_TOKEN_KEY || null;
  if (!enc || !key) return null;
  try {
    const dec = decryptWithPassword(enc, key);
    return dec || null;
  } catch {
    return null;
  }
}
