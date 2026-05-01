import { parse, serialize } from 'cookie'

const SESSION_SECRET = process.env.SESSION_SECRET || 'videsh-fc-secret'
const COOKIE_NAME = 'videsh_admin_session'

export function setAdminCookie(res) {
  const token = Buffer.from(`admin:${SESSION_SECRET}:${Date.now()}`).toString('base64')
  const cookie = serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  res.setHeader('Set-Cookie', cookie)
}

export function clearAdminCookie(res) {
  const cookie = serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  res.setHeader('Set-Cookie', cookie)
}

export function isAdminAuthenticated(req) {
  const cookies = parse(req.headers.cookie || '')
  const token = cookies[COOKIE_NAME]
  if (!token) return false
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    return decoded.startsWith(`admin:${SESSION_SECRET}:`)
  } catch {
    return false
  }
}
