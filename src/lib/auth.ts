import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const DEVELOPMENT_JWT_SECRET = 'development_only_satt_jwt_secret_change_in_production'

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production');
  }

  return DEVELOPMENT_JWT_SECRET;
}

const key = new TextEncoder().encode(getJwtSecret())

export type UserSession = {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export type AuthSession = {
  user: UserSession;
}

export async function encrypt(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1w')
    .sign(key)
}

export async function decrypt(input: string): Promise<Record<string, unknown>> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  })
  return payload
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  if (!session) return null
  try {
    const payload = await decrypt(session)
    return payload as unknown as AuthSession
  } catch {
    return null
  }
}

export async function requireAuth(): Promise<AuthSession> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized: Authentication required");
  }
  return session;
}
