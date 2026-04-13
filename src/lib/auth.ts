import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.JWT_SECRET || 'very_secure_and_random_string_for_satt_jwt'
const key = new TextEncoder().encode(secretKey)

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

export async function getSession(): Promise<{ user: { id: string; email: string; name?: string; role: string } } | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  if (!session) return null
  try {
    const payload = await decrypt(session)
    return payload as unknown as { user: { id: string; email: string; name?: string; role: string } }
  } catch {
    return null
  }
}
