import { setAdminCookie } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { password } = req.body

  if (!password) return res.status(400).json({ error: 'Password required' })

  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return res.status(500).json({ error: 'Admin password not configured' })
  }

  if (password !== adminPassword) {
    return res.status(401).json({ error: 'Incorrect password' })
  }

  setAdminCookie(res)
  return res.status(200).json({ success: true })
}
