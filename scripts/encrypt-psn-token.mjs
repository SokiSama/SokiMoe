import crypto from 'crypto';

function usage() {
  console.log('Usage: node scripts/encrypt-psn-token.mjs <token> <password>');
  process.exit(1);
}

const token = process.argv[2] || process.env.PSN_TOKEN_PLAIN || '';
const password = process.argv[3] || process.env.PSN_TOKEN_KEY || '';
if (!token || !password) usage();

const salt = crypto.randomBytes(16);
const iv = crypto.randomBytes(12);
const key = crypto.scryptSync(password, salt, 32);
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const enc = Buffer.concat([cipher.update(Buffer.from(token, 'utf8')), cipher.final()]);
const tag = cipher.getAuthTag();
const out = [
  'v1',
  salt.toString('base64'),
  iv.toString('base64'),
  enc.toString('base64'),
  tag.toString('base64'),
].join(':');
console.log(out);
