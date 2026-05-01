import { getAdminClient } from '../../../lib/supabaseServer'
import { isAdminAuthenticated } from '../../../lib/auth'

export default async function handler(req, res) {
  const supabase = getAdminClient()

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('date', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    if (!isAdminAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' })

    const { title, description, category, date, emoji, featured } = req.body

    if (!title || !date) return res.status(400).json({ error: 'Missing required fields' })

    const { data, error } = await supabase.from('achievements').insert([{
      title, description, category, date, emoji: emoji || '🏆', featured: Boolean(featured),
    }]).select()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data[0])
  }

  return res.status(405).end()
}
