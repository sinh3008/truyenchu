import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'dev_secret_change_me';
const encodedKey = new TextEncoder().encode(secretKey);

export async function signToken(payload: any): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(encodedKey);
}

export async function verifyToken(token: string): Promise<any | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey);
    return payload;
  } catch {
    return null;
  }
}
